/**
 * Production Content-Security-Policy for the Astro essay sites.
 * Fonts self-hosted. Theme scripts external. JSON-LD via serializeJsonLd.
 * Substack embeds allowed only in frames (podcast/video). Pagefind is same-origin.
 * No 'unsafe-inline' / 'unsafe-eval' — enforced by pub-core security tests.
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
  "img-src 'self' data: https://substackcdn.com https://*.substack.com",
  "media-src 'self' https://*.substack.com https://api.substack.com",
  "frame-src 'self' https://*.substack.com https://substack.com",
  "connect-src 'self'",
  'upgrade-insecure-requests',
].join('; ');
