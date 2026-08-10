export { essayCollectionSchema } from './essay-schema.mjs';
export { CONTENT_SECURITY_POLICY } from './csp.mjs';
export { createVercelConfig } from './vercel.mjs';

/**
 * Build a publication identity object. Sites pass brand-specific fields.
 */
export function defineSiteConfig(config) {
  const substackHost = config.substackHost;
  return {
    ...config,
    substackUrl: `https://${substackHost}`,
    substackFeedUrl: `https://${substackHost}/feed`,
    subscribeUrl: `https://${substackHost}/subscribe`,
  };
}

/**
 * Article JSON-LD for essay pages.
 */
export function articleJsonLd({ title, description, date, updated, url, hero, author = 'Thomas M. Just' }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    datePublished: date instanceof Date ? date.toISOString() : date,
    dateModified: (updated || date) instanceof Date ? (updated || date).toISOString() : updated || date,
    author: { '@type': 'Person', name: author },
    mainEntityOfPage: url,
    image: hero || undefined,
  };
}
