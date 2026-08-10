#!/usr/bin/env node
/**
 * Enforce essay hero image budgets.
 * Warn > 400 KB; error > 1.5 MB or missing file.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import { ERROR_HERO_BYTES, WARN_HERO_BYTES } from './lib/optimize-image.mjs';

const root = process.cwd();
const sitesDir = join(root, 'sites');
const errors = [];
const warnings = [];

const sites = existsSync(sitesDir)
  ? readdirSync(sitesDir, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name)
  : [];

for (const site of sites) {
  const contentDir = join(sitesDir, site, 'src/content/essays');
  if (!existsSync(contentDir)) continue;
  const files = readdirSync(contentDir, { recursive: true }).filter((f) => /\.mdx?$/.test(f));

  for (const file of files) {
    const path = join(contentDir, file);
    const label = `${site}/src/content/essays/${file}`;
    const { data } = matter(readFileSync(path, 'utf8'));
    if (!data.hero || typeof data.hero !== 'string') continue;

    if (!data.hero.startsWith('/')) {
      warnings.push(`${label}: hero is not a public path (${data.hero})`);
      continue;
    }

    const heroPath = join(sitesDir, site, 'public', data.hero.slice(1));
    if (!existsSync(heroPath)) {
      errors.push(`${label}: hero missing at public${data.hero}`);
      continue;
    }

    const size = statSync(heroPath).size;
    if (size > ERROR_HERO_BYTES) {
      errors.push(`${label}: hero ${data.hero} is ${(size / 1024).toFixed(0)} KB (max ${(ERROR_HERO_BYTES / 1024).toFixed(0)} KB) — run npm run optimize:images`);
    } else if (size > WARN_HERO_BYTES) {
      warnings.push(`${label}: hero ${data.hero} is ${(size / 1024).toFixed(0)} KB (prefer ≤ ${(WARN_HERO_BYTES / 1024).toFixed(0)} KB)`);
    }
  }
}

for (const w of warnings) console.warn(`warning: ${w}`);
if (errors.length) {
  for (const e of errors) console.error(`error: ${e}`);
  process.exit(1);
}
console.log(`image check passed for ${sites.length} site(s)${warnings.length ? ` with ${warnings.length} warning(s)` : ''}`);
