import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {
  fetchSubstackPosts,
  renderSubstackExport,
  serializeJsonLd,
  validateSubstackFeedUrl,
} from '../src/index.mjs';

const repoRoot = new URL('../../../', import.meta.url);

const sampleFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Example</title>
    <item>
      <title><![CDATA[First <em>post</em>]]></title>
      <link>https://example.substack.com/p/first</link>
      <pubDate>Tue, 01 Jul 2026 10:00:00 GMT</pubDate>
      <description><![CDATA[Hello & goodbye]]></description>
    </item>
    <item>
      <title>Second post</title>
      <link>https://example.substack.com/p/second</link>
      <pubDate>Wed, 02 Jul 2026 10:00:00 GMT</pubDate>
      <description>Plain</description>
    </item>
  </channel>
</rss>`;

test('fetchSubstackPosts parses RSS items, CDATA, and namespaces', async () => {
  const fetchImpl = async () => ({
    ok: true,
    status: 200,
    url: 'https://example.substack.com/feed',
    text: async () => sampleFeed,
  });

  const posts = await fetchSubstackPosts('https://example.substack.com/feed', {
    expectedHost: 'example.substack.com',
    fetchImpl,
  });
  assert.equal(posts.length, 2);
  assert.equal(posts[0].title, 'First <em>post</em>');
  assert.equal(posts[0].link, 'https://example.substack.com/p/first');
  assert.equal(posts[0].description, 'Hello & goodbye');
  assert.equal(posts[1].title, 'Second post');
});

test('fetchSubstackPosts returns [] for a missing feed URL', async () => {
  const posts = await fetchSubstackPosts('', { fetchImpl: async () => { throw new Error('should not fetch'); } });
  assert.deepEqual(posts, []);
});

test('validateSubstackFeedUrl accepts only HTTPS on the exact expected Substack host', () => {
  const expectedHost = 'example.substack.com';
  assert.equal(
    validateSubstackFeedUrl('https://example.substack.com/feed', expectedHost).href,
    'https://example.substack.com/feed',
  );

  for (const feedUrl of [
    'http://example.substack.com/feed',
    'https://user:password@example.substack.com/feed',
    'https://example.substack.com:444/feed',
    'https://other.substack.com/feed',
    'https://example.substack.com.evil.test/feed',
  ]) {
    assert.throws(() => validateSubstackFeedUrl(feedUrl, expectedHost));
  }
  assert.throws(() => validateSubstackFeedUrl('https://example.test/feed', 'example.test'));
});

test('fetchSubstackPosts rejects invalid URLs before fetch and rejects redirects', async () => {
  let calls = 0;
  const invalid = await fetchSubstackPosts('https://attacker.test/feed', {
    expectedHost: 'example.substack.com',
    fetchImpl: async () => {
      calls += 1;
    },
    warn: () => {},
  });
  assert.deepEqual(invalid, []);
  assert.equal(calls, 0);

  const redirected = await fetchSubstackPosts('https://example.substack.com/feed', {
    expectedHost: 'example.substack.com',
    fetchImpl: async (_url, init) => {
      calls += 1;
      assert.equal(init.redirect, 'manual');
      return { ok: false, status: 302, redirected: false };
    },
    warn: () => {},
  });
  assert.deepEqual(redirected, []);
  assert.equal(calls, 1);
});

test('serializeJsonLd prevents script termination while preserving JSON data', () => {
  const value = {
    title: '</script><script>alert(1)</script>',
    separators: '\u2028\u2029',
  };
  const serialized = serializeJsonLd(value);

  assert.doesNotMatch(serialized, /<\/script/i);
  assert.doesNotMatch(serialized, /[<>&\u2028\u2029]/u);
  assert.deepEqual(JSON.parse(serialized), value);
});

test('site security policy and Claude workflows remain hardened', async () => {
  const sites = ['adversarial-system', 'just-asking-questions'];
  for (const site of sites) {
    const vercel = JSON.parse(await fs.readFile(new URL(`sites/${site}/vercel.json`, repoRoot), 'utf8'));
    const csp = vercel.headers[0].headers.find((header) => header.key === 'Content-Security-Policy')?.value;
    assert.match(csp, /script-src 'self'/);
    assert.match(csp, /object-src 'none'/);
    assert.match(csp, /frame-ancestors 'none'/);
    assert.doesNotMatch(csp, /unsafe-inline|unsafe-eval/);

    const layout = await fs.readFile(new URL(`sites/${site}/src/layouts/Base.astro`, repoRoot), 'utf8');
    assert.match(layout, /serializeJsonLd\(jsonLd\)/);
    assert.doesNotMatch(layout, /JSON\.stringify\(jsonLd\)|<script is:inline>/);

    const astroConfig = await fs.readFile(new URL(`sites/${site}/astro.config.mjs`, repoRoot), 'utf8');
    assert.match(astroConfig, /inlineStylesheets:\s*'never'/);
  }

  for (const workflow of ['claude.yml', 'claude-code-review.yml']) {
    const source = await fs.readFile(new URL(`.github/workflows/${workflow}`, repoRoot), 'utf8');
    const uses = [...source.matchAll(/^\s*uses:\s*(\S+)/gm)].map((match) => match[1]);
    assert.ok(uses.length > 0);
    assert.ok(uses.every((action) => /@[0-9a-f]{40}$/.test(action)));
    assert.doesNotMatch(source, /plugin_marketplaces|allowed_bots:\s*['"]?\*/);
    assert.match(source, /OWNER.*MEMBER.*COLLABORATOR/s);
    assert.match(source, /head(?:\?|\.)?\.repo(?:\?|\.)?\.full_name/);
  }
});

test('renderSubstackExport emits paste-ready HTML with canonical UTM links', async () => {
  const raw = `---
title: "The Seam"
description: "Where machine judgment meets accountability."
date: 2026-07-12
---

## Opening

Read [the record](/essays/the-seam/) and see ![plate](/images/plate.png).

<script>alert("x")</script>
`;

  const html = await renderSubstackExport(raw, {
    slug: 'the-seam',
    siteUrl: 'https://theadversarialsystem.com',
  });

  assert.match(html, /<h1>The Seam<\/h1>/);
  assert.match(html, /utm_source=substack/);
  assert.match(html, /<h3>Opening<\/h3>/);
  assert.match(html, /href="https:\/\/theadversarialsystem.com\/essays\/the-seam\/"/);
  assert.match(html, /src="https:\/\/theadversarialsystem.com\/images\/plate.png"/);
  assert.doesNotMatch(html, /<script>/);
});
