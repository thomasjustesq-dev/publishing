#!/usr/bin/env node
// Validate essay frontmatter and publication readiness across sites/*.
// Usage:
//   node scripts/check-content.mjs
//   REQUIRE_PUBLISHED_ESSAYS=1 node scripts/check-content.mjs

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import matter from 'gray-matter';

const root = process.cwd();
const sitesDir = join(root, 'sites');
const requirePublished = process.env.REQUIRE_PUBLISHED_ESSAYS === '1';

const errors = [];
const warnings = [];

const isUrl = (value) => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

const siteNames = existsSync(sitesDir)
  ? readdirSync(sitesDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
  : [];

for (const site of siteNames) {
  const contentDir = join(sitesDir, site, 'src/content/essays');
  const files = existsSync(contentDir)
    ? readdirSync(contentDir, { recursive: true }).filter((file) => /\.mdx?$/.test(file))
    : [];

  let published = 0;

  for (const file of files) {
    const path = join(contentDir, file);
    const label = `${site}/src/content/essays/${file}`;
    const { data, content } = matter(readFileSync(path, 'utf8'));

    if (/This is a sample essay/i.test(content)) {
      errors.push(`${label}: placeholder sample essay belongs in examples/, not the published collection`);
    }

    if (!data.title || typeof data.title !== 'string') {
      errors.push(`${label}: missing required title`);
    }

    const isDraft = data.draft === true;
    if (!isDraft) {
      published += 1;
      if (!data.description || typeof data.description !== 'string') {
        errors.push(`${label}: published essays require a description`);
      }
    }

    if (!data.date) {
      errors.push(`${label}: missing required date`);
    } else {
      const date = new Date(data.date);
      if (Number.isNaN(date.getTime())) {
        errors.push(`${label}: invalid date ${JSON.stringify(data.date)}`);
      } else if (date.getTime() > Date.now()) {
        errors.push(`${label}: date cannot be in the future (${date.toISOString()})`);
      }
    }

    for (const field of ['canonical', 'substackUrl']) {
      if (data[field] !== undefined && !isUrl(data[field])) {
        errors.push(`${label}: ${field} must be a valid URL`);
      }
    }

    if (data.hero !== undefined) {
      if (typeof data.hero !== 'string' || !data.hero) {
        errors.push(`${label}: hero must be a non-empty string when present`);
      } else if (data.hero.startsWith('/')) {
        const heroPath = join(sitesDir, site, 'public', data.hero.slice(1));
        if (!existsSync(heroPath)) errors.push(`${label}: hero image not found at public${data.hero}`);
      } else if (!/^https?:\/\//i.test(data.hero)) {
        const heroPath = join(dirname(path), data.hero);
        if (!existsSync(heroPath)) errors.push(`${label}: hero image not found relative to essay (${data.hero})`);
      }
    }
  }

  if (published === 0) {
    const message = `${site}: no published essays found`;
    if (requirePublished) errors.push(message);
    else warnings.push(message);
  }
}

for (const warning of warnings) console.warn(`warning: ${warning}`);
if (errors.length) {
  for (const error of errors) console.error(`error: ${error}`);
  process.exit(1);
}

console.log(`content check passed for ${siteNames.length} site(s)${warnings.length ? ` with ${warnings.length} warning(s)` : ''}`);
