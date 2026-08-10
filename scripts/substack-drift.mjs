#!/usr/bin/env node
/**
 * Report Substack posts not yet present as site essays.
 * Usage: node scripts/substack-drift.mjs --site jaq
 * Exit 1 if --fail and any missing (for CI optional job).
 */
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const args = process.argv.slice(2);
const get = (flag) => {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : undefined;
};
const fail = args.includes('--fail');
const siteKey = get('--site') || 'jaq';

const sites = {
  jaq: { dir: 'just-asking-questions', host: 'thomasjustaskingquestions.substack.com' },
  tas: { dir: 'adversarial-system', host: 'theadversarialsystem.substack.com' },
};

const cfg = sites[siteKey];
if (!cfg) {
  console.error('Usage: node scripts/substack-drift.mjs --site jaq|tas [--fail]');
  process.exit(1);
}

const contentDir = join(process.cwd(), 'sites', cfg.dir, 'src/content/essays');
const local = new Set(
  existsSync(contentDir)
    ? readdirSync(contentDir).filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, ''))
    : [],
);

const archive = await (await fetch(`https://${cfg.host}/api/v1/archive?sort=new&limit=50`)).json();
const skip = new Set(['coming-soon']);
const remote = archive.filter((p) => !skip.has(p.slug));
const missing = remote.filter((p) => !local.has(p.slug));

console.log(`${siteKey}: local=${local.size} remote=${remote.length} missing=${missing.length}`);
for (const p of missing) {
  console.log(`  missing: ${p.slug} — ${p.title}`);
}

if (fail && missing.length) process.exit(1);
