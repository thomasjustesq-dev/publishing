import { fetchSubstackPosts as fetchFeed } from '@pub/core';

const host = 'thomasjustaskingquestions.substack.com';
const defaultFeedUrl = `https://${host}/feed`;

export function fetchSubstackPosts(feedUrl = defaultFeedUrl) {
  return fetchFeed(feedUrl, { expectedHost: host });
}
