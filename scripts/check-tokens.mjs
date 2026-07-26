#!/usr/bin/env node
// Verify src/styles/tokens.css contains every machine-readable token in brand/tokens.json.
// This intentionally does not overwrite tokens.css; custom hand-authored rules may live there too.

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const sites = ['adversarial-system', 'just-asking-questions'];
const failures = [];

const kebab = (value) =>
  value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([a-z])([0-9]{2,})/g, '$1-$2')
    .toLowerCase();

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function expectToken(css, site, name, value) {
  const pattern = new RegExp(`${escapeRegExp(name)}:\\s*${escapeRegExp(String(value))}\\s*;`);
  if (!pattern.test(css)) failures.push(`${site}: missing ${name}: ${value};`);
}

for (const site of sites) {
  const siteDir = join(root, 'sites', site);
  const tokens = JSON.parse(readFileSync(join(siteDir, 'brand/tokens.json'), 'utf8'));
  const css = readFileSync(join(siteDir, 'src/styles/tokens.css'), 'utf8');

  for (const theme of ['light', 'dark']) {
    for (const [key, value] of Object.entries(tokens.color?.[theme] || {})) {
      expectToken(css, site, `--${kebab(key)}`, value);
    }
  }

  for (const key of ['display', 'body', 'mono']) {
    if (tokens.type?.[key]) expectToken(css, site, `--font-${key}`, tokens.type[key]);
  }

  for (const [key, value] of Object.entries(tokens.layout || {})) {
    expectToken(css, site, `--${kebab(key)}`, value);
  }
}

if (failures.length) {
  for (const failure of failures) console.error(`error: ${failure}`);
  process.exit(1);
}

console.log(`token check passed for ${sites.length} site(s)`);
