#!/usr/bin/env node
/**
 * Import Substack posts into a publication's Astro content collection.
 *
 * Usage:
 *   node scripts/import-substack.mjs --site jaq
 *   node scripts/import-substack.mjs --site jaq --slug the-stoicism-question
 *   node scripts/import-substack.mjs --site jaq --dry-run
 *
 * - Fetches archive + per-post JSON from Substack's public API
 * - Converts body HTML → markdown (Turndown)
 * - Downloads cover + in-body images under public/essays/<slug>/
 * - Writes published essays (draft: false) with substackUrl
 * - Skips "coming-soon" and empty bodies unless --include-stubs
 */

import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import TurndownService from 'turndown';
import { optimizeBufferToWebp } from './lib/optimize-image.mjs';

const args = process.argv.slice(2);
const get = (flag) => {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : undefined;
};
const has = (flag) => args.includes(flag);

const siteKey = get('--site');
const onlySlug = get('--slug');
const dryRun = has('--dry-run');
const includeStubs = has('--include-stubs');
const noOverwrite = has('--no-overwrite');

const sites = {
  jaq: {
    dir: 'just-asking-questions',
    host: 'thomasjustaskingquestions.substack.com',
  },
  'just-asking-questions': {
    dir: 'just-asking-questions',
    host: 'thomasjustaskingquestions.substack.com',
  },
  tas: {
    dir: 'adversarial-system',
    host: 'theadversarialsystem.substack.com',
  },
  'adversarial-system': {
    dir: 'adversarial-system',
    host: 'theadversarialsystem.substack.com',
  },
};

if (!siteKey || !sites[siteKey]) {
  console.error('Usage: node scripts/import-substack.mjs --site jaq|tas [--slug <slug>] [--dry-run] [--include-stubs] [--no-overwrite]');
  process.exit(1);
}

const { dir: siteDir, host } = sites[siteKey];
const root = process.cwd();
const contentDir = join(root, 'sites', siteDir, 'src/content/essays');
const publicEssaysDir = join(root, 'sites', siteDir, 'public/essays');

const SKIP_SLUGS = new Set(['coming-soon']);

const turndown = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
  emDelimiter: '*',
});

turndown.addRule('dropSubstackChrome', {
  filter: (node) => {
    if (node.nodeType !== 1) return false;
    const cls = node.getAttribute?.('class') || '';
    const name = node.getAttribute?.('data-component-name') || '';
    return (
      cls.includes('subscription-widget') ||
      cls.includes('install-substack-app') ||
      cls.includes('paywall') ||
      cls.includes('button-wrapper') ||
      name === 'SubscribeWidgetToDOM' ||
      name === 'InstallSubstackAppToDOM' ||
      name === 'VideoPlaceholder' ||
      name === 'ButtonCreateButton'
    );
  },
  replacement: () => '',
});

function yamlQuote(value) {
  return JSON.stringify(String(value ?? ''));
}

function dateOnly(iso) {
  return new Date(iso).toISOString().slice(0, 10);
}

async function downloadBuffer(url) {
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) throw new Error(`download failed ${res.status} ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

async function localizeImages(html, slug) {
  const imgDir = join(publicEssaysDir, slug);
  const urls = new Set();
  const re = /<img[^>]+src=["']([^"']+)["']/gi;
  let m;
  while ((m = re.exec(html))) urls.add(m[1]);

  let out = html;
  let i = 0;
  for (const url of urls) {
    if (!/^https?:\/\//i.test(url)) continue;
    if (url.includes('substack.com/app') || url.includes('install-substack')) continue;
    i += 1;
    const filename = `img-${String(i).padStart(2, '0')}.webp`;
    const dest = join(imgDir, filename);
    const publicPath = `/essays/${slug}/${filename}`;
    if (!dryRun) {
      try {
        mkdirSync(imgDir, { recursive: true });
        const buf = await downloadBuffer(url);
        await optimizeBufferToWebp(buf, dest);
      } catch (err) {
        console.warn(`  warn: image skip ${url} (${err.message})`);
        continue;
      }
    }
    out = out.split(url).join(publicPath);
  }
  return out;
}

async function fetchArchive() {
  const url = `https://${host}/api/v1/archive?sort=new&limit=50`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`archive ${res.status}`);
  return res.json();
}

async function fetchPost(slug) {
  const url = `https://${host}/api/v1/posts/${encodeURIComponent(slug)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`post ${slug} ${res.status}`);
  return res.json();
}

function isMostlyChrome(html) {
  if (!html || html.length < 80) return true;
  const stripped = html
    .replace(/<div class="install-substack-app[\s\S]*?<\/div>/gi, '')
    .replace(/<div class="subscription-widget[\s\S]*?<\/div>/gi, '')
    .replace(/<[^>]+>/g, '')
    .trim();
  return stripped.length < 40;
}

const archive = await fetchArchive();
const posts = onlySlug ? archive.filter((p) => p.slug === onlySlug) : archive;

if (!posts.length) {
  console.log(`No posts found for ${host}${onlySlug ? ` (slug ${onlySlug})` : ''}`);
  process.exit(0);
}

mkdirSync(contentDir, { recursive: true });

let written = 0;
let skipped = 0;

for (const entry of posts) {
  const slug = entry.slug;
  if (SKIP_SLUGS.has(slug)) {
    console.log(`skip ${slug} (stub slug)`);
    skipped += 1;
    continue;
  }

  const outPath = join(contentDir, `${slug}.md`);
  if (noOverwrite && existsSync(outPath)) {
    const existing = readFileSync(outPath, 'utf8');
    if (/imported:\s*false/i.test(existing) || !/imported:\s*true/i.test(existing)) {
      console.log(`skip ${slug} (exists; --no-overwrite and not imported:true)`);
      skipped += 1;
      continue;
    }
  }

  const post = await fetchPost(slug);
  const title = (post.title || entry.title || slug).trim();
  const description = (post.subtitle || post.description || entry.description || title).trim();
  const date = post.post_date || entry.post_date;
  const substackUrl = post.canonical_url || `https://${host}/p/${slug}`;
  const audience = post.audience || entry.audience || 'everyone';
  const type = post.type || entry.type || 'newsletter';
  let bodyHtml = post.body_html || '';
  let format = 'essay';
  let paywalled = false;
  let videoUrl;
  let audioUrl;

  if (type === 'podcast') format = 'podcast';
  if (isMostlyChrome(bodyHtml) && !includeStubs) {
    if (type === 'podcast') {
      format = 'podcast';
      bodyHtml = `<p>Podcast episode. Listen on <a href="${substackUrl}">Substack</a>.</p>`;
    } else if (audience === 'only_paid') {
      format = 'teaser';
      paywalled = true;
      bodyHtml = `<p>${description}</p><p><em>This essay is currently paywalled on Substack. The designed site will carry the full text when a free or public version is available — read it for subscribers on <a href="${substackUrl}">Substack</a>.</em></p><p>${post.truncated_body_text || ''}</p>`;
    } else {
      console.log(`skip ${slug} (empty body)`);
      skipped += 1;
      continue;
    }
  } else if (audience === 'only_paid' && (post.body_html || '').length < 2000) {
    format = 'teaser';
    paywalled = true;
    bodyHtml = `${bodyHtml}<p><em>Full essay available to subscribers on <a href="${substackUrl}">Substack</a>.</em></p>`;
  }
  // Heuristic: short body + cover often means video-native Substack post
  if (format === 'essay' && bodyHtml.replace(/<[^>]+>/g, '').trim().length < 500 && post.cover_image) {
    // leave essay unless content is clearly a video post with stub text
  }

  bodyHtml = await localizeImages(bodyHtml, slug);
  let markdown = turndown.turndown(bodyHtml).trim();
  markdown = markdown.replace(/\n{3,}/g, '\n\n');

  let hero;
  if (post.cover_image) {
    const heroDest = join(publicEssaysDir, slug, 'cover.webp');
    const ogDest = join(publicEssaysDir, slug, 'og.webp');
    hero = `/essays/${slug}/cover.webp`;
    if (!dryRun) {
      try {
        mkdirSync(dirname(heroDest), { recursive: true });
        const buf = await downloadBuffer(post.cover_image);
        await optimizeBufferToWebp(buf, heroDest, { ogPath: ogDest });
      } catch (err) {
        console.warn(`  warn: cover skip ${slug} (${err.message})`);
        hero = undefined;
      }
    }
  }

  const tags = [];
  if (format === 'podcast') tags.push('podcast');
  if (format === 'video') tags.push('video');
  if (paywalled || audience === 'only_paid') tags.push('substack-paid');

  const frontmatter = [
    '---',
    `title: ${yamlQuote(title)}`,
    `description: ${yamlQuote(description)}`,
    `date: ${dateOnly(date)}`,
    `substackUrl: ${yamlQuote(substackUrl)}`,
    `draft: false`,
    `format: ${yamlQuote(format)}`,
    `paywalled: ${paywalled}`,
    `imported: true`,
    `importSource: ${yamlQuote(substackUrl)}`,
    `tags: [${tags.map((t) => yamlQuote(t)).join(', ')}]`,
  ];
  if (hero) {
    frontmatter.push(`hero: ${yamlQuote(hero)}`);
    frontmatter.push(`heroAlt: ${yamlQuote(`Cover image for ${title}`)}`);
  }
  if (videoUrl) frontmatter.push(`videoUrl: ${yamlQuote(videoUrl)}`);
  if (audioUrl) frontmatter.push(`audioUrl: ${yamlQuote(audioUrl)}`);
  frontmatter.push('---', '', markdown, '');

  console.log(`${dryRun ? 'would write' : 'write'} ${outPath} (${markdown.length} chars, format=${format}, audience=${audience})`);
  if (!dryRun) writeFileSync(outPath, frontmatter.join('\n'));
  written += 1;
}

// Remove scaffold welcome if we imported real essays
const welcome = join(contentDir, 'welcome.md');
if (!dryRun && written > 0 && existsSync(welcome)) {
  // leave welcome only if still draft sample — delete to avoid clutter
  const { readFileSync, unlinkSync } = await import('node:fs');
  const text = readFileSync(welcome, 'utf8');
  if (/draft:\s*true/.test(text) && /pipeline essay|sample essay/i.test(text)) {
    unlinkSync(welcome);
    console.log(`removed scaffold ${welcome}`);
  }
}

console.log(`done: wrote ${written}, skipped ${skipped}${dryRun ? ' (dry-run)' : ''}`);
