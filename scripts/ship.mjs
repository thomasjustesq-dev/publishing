#!/usr/bin/env node
/**
 * Pre-ship gate for an essay.
 * Usage: node scripts/ship.mjs --site jaq --slug my-essay
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'path';
import { spawnSync } from 'node:child_process';
import matter from 'gray-matter';

const args = process.argv.slice(2);
const get = (flag) => {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : undefined;
};

const siteKey = get('--site');
const slug = get('--slug');
const sites = {
  jaq: 'just-asking-questions',
  tas: 'adversarial-system',
  'just-asking-questions': 'just-asking-questions',
  'adversarial-system': 'adversarial-system',
};

if (!siteKey || !slug || !sites[siteKey]) {
  console.error('Usage: node scripts/ship.mjs --site jaq|tas --slug <slug>');
  process.exit(1);
}

const path = join(process.cwd(), 'sites', sites[siteKey], 'src/content/essays', `${slug}.md`);
if (!existsSync(path)) {
  console.error(`missing ${path}`);
  process.exit(1);
}

const { data, content } = matter(readFileSync(path, 'utf8'));
const errors = [];
if (data.draft === true) errors.push('essay is still draft: true');
if (!data.description || String(data.description).length < 20) {
  errors.push('published essays need description ≥ 20 chars');
}
if ((data.format || 'essay') === 'essay' && !data.hero) {
  errors.push('essay format should include hero image');
}
if ((data.paywalled || data.format === 'teaser') && !data.substackUrl) {
  errors.push('teaser/paywalled needs substackUrl');
}
if (content.trim().length < 80 && data.format === 'essay' && !data.paywalled) {
  errors.push('essay body looks too short');
}

if (errors.length) {
  for (const e of errors) console.error(`error: ${e}`);
  process.exit(1);
}

console.log(`essay ${slug} frontmatter OK — running publish:check`);
const r = spawnSync('npm', ['run', 'publish:check'], { stdio: 'inherit', shell: process.platform === 'win32' });
process.exit(r.status || 0);
