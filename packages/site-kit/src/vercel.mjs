import { CONTENT_SECURITY_POLICY } from './csp.mjs';

/**
 * Vercel project config for a site whose Root Directory is `sites/<name>`.
 * Install runs at the monorepo root (single lockfile / workspaces).
 */
export function createVercelConfig() {
  return {
    framework: 'astro',
    installCommand: 'cd ../.. && npm ci',
    buildCommand: 'npm run build',
    outputDirectory: 'dist',
    headers: [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: CONTENT_SECURITY_POLICY },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'DENY' },
        ],
      },
    ],
  };
}
