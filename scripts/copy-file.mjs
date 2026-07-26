#!/usr/bin/env node
import { copyFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const [source, destination] = process.argv.slice(2);
if (!source || !destination) {
  console.error('usage: node scripts/copy-file.mjs <source> <destination>');
  process.exit(1);
}

mkdirSync(dirname(destination), { recursive: true });
copyFileSync(source, destination);
console.log(`copied ${source} -> ${destination}`);
