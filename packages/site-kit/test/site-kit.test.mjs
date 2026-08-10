import test from 'node:test';
import assert from 'node:assert/strict';
import { z } from 'zod';
import { articleJsonLd, defineSiteConfig, essayCollectionSchema, CONTENT_SECURITY_POLICY, createVercelConfig } from '../src/index.mjs';

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
  const vercel = createVercelConfig();
  assert.equal(vercel.installCommand, 'cd ../.. && npm ci');
  assert.equal(vercel.outputDirectory, 'dist');
});
