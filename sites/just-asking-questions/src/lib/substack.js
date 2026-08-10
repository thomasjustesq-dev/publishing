import { fetchSubstackPosts as fetchFeed } from '@pub/core';
import { siteConfig } from '../site.config.js';

export function fetchSubstackPosts(
  feedUrl = import.meta.env.SUBSTACK_FEED_URL || process.env.SUBSTACK_FEED_URL || siteConfig.substackFeedUrl,
) {
  return fetchFeed(feedUrl, { expectedHost: siteConfig.substackHost });
}
