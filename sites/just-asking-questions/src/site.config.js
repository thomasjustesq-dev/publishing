import { defineSiteConfig } from '@pub/site-kit';

export const siteConfig = defineSiteConfig({
  id: 'jaq',
  name: 'Just Asking Questions',
  description: 'Long-form essays by Thomas M. Just.',
  siteUrl: 'https://www.just-asking-questions.com',
  author: 'Thomas M. Just',
  tagline: 'No verdicts withheld',
  byline: 'THOMAS M. JUST · NO VERDICTS WITHHELD',
  themeStorageKey: 'jaq-theme',
  substackHost: 'thomasjustaskingquestions.substack.com',
  defaultOgImage: '/social/og-card-1200x630.webp',
  favicon: '/favicon.svg',
  boilerplate:
    'Just Asking Questions is a long-form essay publication by Thomas M. Just — trial attorney, USAF veteran.',
});
