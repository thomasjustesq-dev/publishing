#!/usr/bin/env node
// Convert an essay markdown file into paste-ready HTML for the Substack editor.
//
//   node scripts/substack-export.mjs <path-to-essay.md> [--site-url https://example.com] [--out file.html] [--stdout]
//
// Output defaults to <essay>.substack.html next to the source file. Open it in a
// browser, select all, copy, paste into a new Substack draft.

import { readFileSync, writeFileSync } from 'node:fs';
import { basename } from 'node:path';
import { renderSubstackExport } from '@pub/core';

const args = process.argv.slice(2);
const file = args.find((arg) => !arg.startsWith('--'));
const valueFor = (flag) => {
  const index = args.indexOf(flag);
  return index === -1 ? null : args[index + 1];
};

if (!file) {
  console.error('usage: node scripts/substack-export.mjs <essay.md> [--site-url URL] [--out file.html] [--stdout]');
  process.exit(1);
}

const slug = basename(file).replace(/\.mdx?$/, '');
const siteUrl = valueFor('--site-url') || process.env.PUBLIC_SITE_URL || null;
const html = await renderSubstackExport(readFileSync(file, 'utf8'), { slug, siteUrl });

if (args.includes('--stdout')) {
  console.log(html);
} else {
  const dest = valueFor('--out') || file.replace(/\.mdx?$/, '.substack.html');
  writeFileSync(dest, html);
  console.log(`wrote ${dest}`);
  console.log('open it in a browser, select all, copy, and paste into a Substack draft.');
}
