import { CONTENT_SECURITY_POLICY } from './csp.mjs';

const securityHeaders = [
  { key: 'Content-Security-Policy', value: CONTENT_SECURITY_POLICY },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'DENY' },
];

/** Looser CSP for Decap CMS admin shell (loads CMS from unpkg). */
const adminCsp = [
  "default-src 'self'",
  "base-uri 'none'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "script-src 'self' https://unpkg.com 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline' https://unpkg.com",
  "img-src 'self' data: https:",
  "font-src 'self' data: https:",
  "connect-src 'self' https://api.github.com https://github.com",
  "frame-src 'self' https://github.com",
].join('; ');

const longCache = [
  { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
];

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
        source: '/admin/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: adminCsp },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
      {
        source: '/_astro/(.*)',
        headers: [...securityHeaders, ...longCache],
      },
      {
        source: '/essays/(.*)\\.(webp|jpg|jpeg|png|avif|gif)',
        headers: [...securityHeaders, ...longCache],
      },
      {
        source: '/brand/(.*)',
        headers: [...securityHeaders, ...longCache],
      },
      {
        source: '/social/(.*)',
        headers: [...securityHeaders, ...longCache],
      },
      {
        source: '/pagefind/(.*)',
        headers: [...securityHeaders, ...longCache],
      },
      {
        source: '/fonts/(.*)',
        headers: [...securityHeaders, ...longCache],
      },
    ],
  };
}
