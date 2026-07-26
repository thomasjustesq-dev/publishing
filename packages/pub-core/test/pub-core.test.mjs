import test from 'node:test';
import assert from 'node:assert/strict';
import { fetchSubstackPosts, renderSubstackExport } from '../src/index.mjs';

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
    text: async () => sampleFeed,
  });

  const posts = await fetchSubstackPosts('https://example.substack.com/feed', { fetchImpl });
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
