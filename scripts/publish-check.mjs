#!/usr/bin/env node
/** Run content/token/image checks + full site build. */
import { spawnSync } from 'node:child_process';

const steps = [
  ['npm', ['run', 'check']],
  ['npm', ['run', 'build']],
];

for (const [cmd, args] of steps) {
  console.log(`\n→ ${cmd} ${args.join(' ')}`);
  const result = spawnSync(cmd, args, { stdio: 'inherit', shell: process.platform === 'win32' });
  if (result.status !== 0) process.exit(result.status || 1);
}

console.log('\npublish-check passed');
