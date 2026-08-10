import test from 'node:test';
import assert from 'node:assert/strict';
import { z } from 'zod';
import {
  articleJsonLd,
  defineSiteConfig,
  essayCollectionSchema,
  CONTENT_SECURITY_POLICY,
  createVercelConfig,
  websiteJsonLd,
  personJsonLd,
  publishedOnly,
  essayFilter,
} from '../src/index.mjs';

test('essayCollectionSchema accepts a published essay shape', () => {
  const schema = essayCollectionSchema(z);
  const parsed = schema.parse({
    title: 'Hello',
    description: 'World',
    date: '2026-01-01',
    tags: ['law'],
  });
  assert.equal(parsed.title, 'Hello');
  assert.equal(parsed.draft, false);
  assert.deepEqual(parsed.tags, ['law']);
});

test('essayCollectionSchema rejects future dates', () => {
  const schema = essayCollectionSchema(z);
  assert.throws(() =>
    schema.parse({
      title: 'Future',
      date: '2099-01-01',
    }),
  );
});

test('defineSiteConfig derives Substack URLs', () => {
  const config = defineSiteConfig({
    name: 'Test',
    substackHost: 'example.substack.com',
  });
  assert.equal(config.substackFeedUrl, 'https://example.substack.com/feed');
  assert.equal(config.subscribeUrl, 'https://example.substack.com/subscribe');
});

test('articleJsonLd shapes Article markup', () => {
  const ld = articleJsonLd({
    title: 'T',
    description: 'D',
    date: new Date('2026-01-02T00:00:00.000Z'),
    url: 'https://example.com/essays/t/',
  });
  assert.equal(ld['@type'], 'Article');
  assert.equal(ld.headline, 'T');
  assert.equal(ld.datePublished, '2026-01-02T00:00:00.000Z');
});

test('CSP and vercel config are production-ready', () => {
  assert.match(CONTENT_SECURITY_POLICY, /font-src 'self'/);
  assert.doesNotMatch(CONTENT_SECURITY_POLICY, /fonts\.googleapis/);
  assert.match(CONTENT_SECURITY_POLICY, /frame-src/);
  const vercel = createVercelConfig();
  assert.equal(vercel.installCommand, 'cd ../.. && npm ci');
  assert.equal(vercel.outputDirectory, 'dist');
  assert.ok(vercel.headers.some((h) => h.source === '/_astro/(.*)'));
});

test('essay schema accepts format and paywall fields', () => {
  const schema = essayCollectionSchema(z);
  const parsed = schema.parse({
    title: 'Teaser',
    description: 'D',
    date: '2026-01-01',
    format: 'teaser',
    paywalled: true,
    substackUrl: 'https://example.substack.com/p/x',
    imported: true,
  });
  assert.equal(parsed.format, 'teaser');
  assert.equal(parsed.paywalled, true);
});

test('website and person JSON-LD shapes', () => {
  const w = websiteJsonLd({ name: 'JAQ', url: 'https://example.com/', description: 'D' });
  assert.equal(w['@type'], 'WebSite');
  const p = personJsonLd({ url: 'https://example.com/about/', sameAs: ['https://x.com'] });
  assert.equal(p['@type'], 'Person');
  assert.deepEqual(p.sameAs, ['https://x.com']);
});

test('draft filters', () => {
  assert.equal(publishedOnly({ data: { draft: true } }), false);
  assert.equal(publishedOnly({ data: { draft: false } }), true);
  assert.equal(essayFilter({ data: { draft: true } }, { DEV: true }), true);
  assert.equal(essayFilter({ data: { draft: true } }, { PROD: true, PUBLIC_SHOW_DRAFTS: undefined }), false);
  assert.equal(essayFilter({ data: { draft: true } }, { PROD: true, PUBLIC_SHOW_DRAFTS: '1' }), true);
});
