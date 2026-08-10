#!/usr/bin/env node
/**
 * Push Decap GitHub OAuth secrets to the JAQ Vercel project.
 *
 * Usage:
 *   OAUTH_GITHUB_CLIENT_ID=... OAUTH_GITHUB_CLIENT_SECRET=... node scripts/set-oauth-env.mjs
 *
 * Requires `vercel` CLI logged in as the project owner.
 */
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const siteCwd = path.join(root, 'sites', 'just-asking-questions');

const clientId = process.env.OAUTH_GITHUB_CLIENT_ID?.trim();
const clientSecret = process.env.OAUTH_GITHUB_CLIENT_SECRET?.trim();
const origins =
  process.env.OAUTH_ORIGINS?.trim() ||
  'https://www.just-asking-questions.com,https://www.theadversarialsystem.com';
const redirect =
  process.env.OAUTH_REDIRECT_URL?.trim() ||
  'https://www.just-asking-questions.com/api/callback';

if (!clientId || !clientSecret) {
  console.error(
    'Set OAUTH_GITHUB_CLIENT_ID and OAUTH_GITHUB_CLIENT_SECRET in the environment first.\n' +
      'Create the OAuth App at https://github.com/settings/applications/new\n' +
      'Callback URL: https://www.just-asking-questions.com/api/callback',
  );
  process.exit(1);
}

function addEnv(name, value, environments) {
  for (const env of environments) {
    // vercel env add NAME environment  (reads value from stdin)
    const r = spawnSync(
      'vercel',
      ['env', 'add', name, env, '--cwd', siteCwd, '--force'],
      {
        input: `${value}\n`,
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe'],
      },
    );
    if (r.status !== 0) {
      console.error(`Failed to set ${name} on ${env}:`, r.stderr || r.stdout);
      process.exit(r.status || 1);
    }
    console.log(`set ${name} → ${env}`);
  }
}

const envs = ['production', 'preview'];
addEnv('OAUTH_GITHUB_CLIENT_ID', clientId, envs);
addEnv('OAUTH_GITHUB_CLIENT_SECRET', clientSecret, envs);
addEnv('OAUTH_ORIGINS', origins, envs);
addEnv('OAUTH_REDIRECT_URL', redirect, envs);

console.log('\nDone. Redeploy JAQ for Production to pick up secrets:');
console.log('  vercel --prod --cwd sites/just-asking-questions');
console.log('Smoke: https://www.just-asking-questions.com/admin/');
