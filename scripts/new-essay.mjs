#!/usr/bin/env node
// Scaffold a draft essay markdown file under a publication's content collection.
// Usage:
//   npm run new-essay -- --site jaq --slug my-essay --title "My Essay"
//   npm run new-essay -- --site tas --slug docket-001 --title "Title" --publish

import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const args = process.argv.slice(2);
const get = (flag) => {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : undefined;
};
const has = (flag) => args.includes(flag);

const siteKey = get('--site');
const slug = get('--slug');
const title = get('--title');
const draft = !has('--publish');

const sites = {
  jaq: 'just-asking-questions',
  'just-asking-questions': 'just-asking-questions',
  tas: 'adversarial-system',
  'adversarial-system': 'adversarial-system',
};

if (!siteKey || !slug || !title || !sites[siteKey]) {
  console.error(`Usage: npm run new-essay -- --site jaq|tas --slug <slug> --title "Title" [--publish]`);
  process.exit(1);
}

if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  console.error('error: --slug must be lowercase kebab-case (e.g. my-essay-title)');
  process.exit(1);
}

const site = sites[siteKey];
const dir = join(process.cwd(), 'sites', site, 'src/content/essays');
const path = join(dir, `${slug}.md`);

if (existsSync(path)) {
  console.error(`error: already exists: ${path}`);
  process.exit(1);
}

mkdirSync(dir, { recursive: true });

const today = new Date().toISOString().slice(0, 10);
const body = `---
title: ${JSON.stringify(title)}
description: ""
date: ${today}
draft: ${draft}
tags: []
---

Write the essay here.

`;

writeFileSync(path, body);
console.log(`created ${path}${draft ? ' (draft)' : ' (published frontmatter — fill description before check)'}`);
