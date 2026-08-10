#!/usr/bin/env node
// Write identical vercel.json files for each site from @pub/site-kit.
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createVercelConfig } from '../packages/site-kit/src/vercel.mjs';

const root = process.cwd();
const config = createVercelConfig();
const json = `${JSON.stringify(config, null, 2)}\n`;

for (const site of ['adversarial-system', 'just-asking-questions']) {
  const path = join(root, 'sites', site, 'vercel.json');
  writeFileSync(path, json);
  console.log(`wrote ${path}`);
}
