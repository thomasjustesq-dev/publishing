/**
 * Production Content-Security-Policy for the Astro essay sites.
 * Fonts are self-hosted via @fontsource; no Google Fonts CDN.
 * No 'unsafe-inline' / 'unsafe-eval' — enforced by pub-core security tests.
 * JSON-LD remains in-document via serializeJsonLd (non-executable type); theme
 * scripts are external files under public/.
 */
export const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "base-uri 'none'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "script-src 'self'",
  "style-src 'self'",
  "font-src 'self'",
  "img-src 'self' data:",
  "connect-src 'self'",
  'upgrade-insecure-requests',
].join('; ');
