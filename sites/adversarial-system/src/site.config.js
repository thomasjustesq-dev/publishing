import { defineSiteConfig } from '@pub/site-kit';

export const siteConfig = defineSiteConfig({
  id: 'tas',
  name: 'The Adversarial System',
  description: 'Writing from the edge of AI, security, and liberty.',
  siteUrl: 'https://theadversarialsystem.com',
  author: 'Thomas M. Just',
  tagline: 'Writing from the edge of AI, security, and liberty',
  byline: 'Thomas M. Just',
  themeStorageKey: 'tas-theme',
  substackHost: 'theadversarialsystem.substack.com',
  defaultOgImage: '/social/og-card-1200x630.png',
  favicon: '/favicon.svg',
  boilerplate:
    'The Adversarial System is a publication of essays by Thomas M. Just on what happens where machine systems, state power, and individual rights collide.',
});
