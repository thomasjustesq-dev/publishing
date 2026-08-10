#!/usr/bin/env node
/**
 * Recompress essay images under sites/<site>/public/essays and rewrite hero frontmatter to .webp.
 *
 * Usage:
 *   node scripts/optimize-essay-images.mjs --site jaq
 *   node scripts/optimize-essay-images.mjs --site all --dry-run
 */
import { existsSync, readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join, extname, basename } from 'node:path';
import matter from 'gray-matter';
import { optimizeEssayImage } from './lib/optimize-image.mjs';

const args = process.argv.slice(2);
const get = (flag) => {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : undefined;
};
const has = (flag) => args.includes(flag);

const siteKey = get('--site') || 'all';
const dryRun = has('--dry-run');
const force = has('--force');

const siteMap = {
  jaq: 'just-asking-questions',
  'just-asking-questions': 'just-asking-questions',
  tas: 'adversarial-system',
  'adversarial-system': 'adversarial-system',
  all: null,
};

if (!(siteKey in siteMap)) {
  console.error('Usage: node scripts/optimize-essay-images.mjs --site jaq|tas|all [--dry-run] [--force]');
  process.exit(1);
}

const root = process.cwd();
const sites =
  siteKey === 'all'
    ? ['just-asking-questions', 'adversarial-system']
    : [siteMap[siteKey]];

const IMAGE_RE = /\.(jpe?g|png|webp|gif|avif)$/i;

let optimized = 0;
let rewritten = 0;

for (const site of sites) {
  const publicEssays = join(root, 'sites', site, 'public/essays');
  const contentDir = join(root, 'sites', site, 'src/content/essays');
  if (!existsSync(publicEssays)) {
    console.log(`${site}: no public/essays`);
    continue;
  }

  const slugDirs = readdirSync(publicEssays, { withFileTypes: true }).filter((d) => d.isDirectory());

  for (const dirent of slugDirs) {
    const slug = dirent.name;
    const dir = join(publicEssays, slug);
    const files = readdirSync(dir).filter((f) => IMAGE_RE.test(f));

    for (const file of files) {
      if (file === 'og.webp' || file.endsWith('-og.webp')) continue;
      const abs = join(dir, file);
      const before = statSync(abs).size;
      if (dryRun) {
        console.log(`would optimize ${site}/essays/${slug}/${file} (${before} bytes)`);
        continue;
      }
      const isCover = basename(file, extname(file)) === 'cover';
      const result = await optimizeEssayImage(abs, {
        force,
        writeOg: isCover,
        removeOriginal: true,
      });
      console.log(
        `optimize ${site}/essays/${slug}/${file} → ${basename(result.displayPath)} (${before} → ${result.displayBytes} bytes)${result.skipped ? ' [skipped]' : ''}`,
      );
      optimized += 1;
    }

    // Rewrite hero in markdown if present
    const mdPath = join(contentDir, `${slug}.md`);
    if (!existsSync(mdPath)) continue;
    const raw = readFileSync(mdPath, 'utf8');
    const parsed = matter(raw);
    if (!parsed.data.hero || typeof parsed.data.hero !== 'string') continue;

    const coverWebp = `/essays/${slug}/cover.webp`;
    if (existsSync(join(root, 'sites', site, 'public', coverWebp.slice(1)))) {
      if (parsed.data.hero !== coverWebp) {
        if (dryRun) {
          console.log(`would rewrite hero ${slug}: ${parsed.data.hero} → ${coverWebp}`);
        } else {
          parsed.data.hero = coverWebp;
          const out = matter.stringify(parsed.content.replace(/^\n+/, ''), parsed.data);
          writeFileSync(mdPath, out.endsWith('\n') ? out : `${out}\n`);
          console.log(`rewrite hero ${slug} → ${coverWebp}`);
          rewritten += 1;
        }
      }
    }
  }
}

console.log(`done: optimized ${optimized}, rewrote ${rewritten} hero field(s)${dryRun ? ' (dry-run)' : ''}`);
