#!/usr/bin/env node
/**
 * Set substackUrl on an essay frontmatter file.
 * Usage: node scripts/set-substack-url.mjs --site jaq --slug my-essay --url https://…
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';

const args = process.argv.slice(2);
const get = (flag) => {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : undefined;
};

const siteKey = get('--site');
const slug = get('--slug');
const url = get('--url');

const sites = {
  jaq: 'just-asking-questions',
  'just-asking-questions': 'just-asking-questions',
  tas: 'adversarial-system',
  'adversarial-system': 'adversarial-system',
};

if (!siteKey || !slug || !url || !sites[siteKey]) {
  console.error('Usage: node scripts/set-substack-url.mjs --site jaq|tas --slug <slug> --url <https://…>');
  process.exit(1);
}

try {
  // eslint-disable-next-line no-new
  new URL(url);
} catch {
  console.error('error: --url must be a valid URL');
  process.exit(1);
}

const path = join(process.cwd(), 'sites', sites[siteKey], 'src/content/essays', `${slug}.md`);
if (!existsSync(path)) {
  console.error(`error: missing ${path}`);
  process.exit(1);
}

const parsed = matter(readFileSync(path, 'utf8'));
parsed.data.substackUrl = url;
const out = matter.stringify(parsed.content.replace(/^\n+/, ''), parsed.data);
writeFileSync(path, out.endsWith('\n') ? out : `${out}\n`);
console.log(`updated substackUrl on ${path}`);
