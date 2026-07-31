import { XMLParser } from 'fast-xml-parser';

const parser = new XMLParser({
  ignoreAttributes: true,
  removeNSPrefix: true,
  parseTagValue: false,
  trimValues: true,
});

const asArray = (value) => {
  if (value === undefined || value === null) return [];
  return Array.isArray(value) ? value : [value];
};

const text = (value) => {
  if (value === undefined || value === null) return '';
  if (typeof value === 'object') {
    if ('#text' in value) return String(value['#text']).trim();
    if ('#cdata' in value) return String(value['#cdata']).trim();
    if ('href' in value) return String(value.href).trim();
    return '';
  }
  return String(value).trim();
};

const SUBSTACK_HOST_SUFFIX = '.substack.com';

export function validateSubstackFeedUrl(feedUrl, expectedHost) {
  let url;

  try {
    url = new URL(feedUrl);
  } catch {
    throw new TypeError('Invalid Substack feed URL');
  }

  const normalizedExpectedHost = String(expectedHost || '').toLowerCase();
  if (!normalizedExpectedHost.endsWith(SUBSTACK_HOST_SUFFIX)) {
    throw new TypeError('Expected host must be a Substack hostname');
  }
  if (url.protocol !== 'https:') {
    throw new TypeError('Substack feed URL must use HTTPS');
  }
  if (url.username || url.password) {
    throw new TypeError('Substack feed URL must not contain credentials');
  }
  if (url.port) {
    throw new TypeError('Substack feed URL must not use a custom port');
  }
  if (url.hostname.toLowerCase() !== normalizedExpectedHost) {
    throw new TypeError('Substack feed URL host is not allowed');
  }

  return url;
}

export async function fetchSubstackPosts(feedUrl, options = {}) {
  const {
    timeoutMs = 8000,
    fetchImpl = fetch,
    warn = console.warn,
    expectedHost,
  } = options;

  if (!feedUrl || feedUrl.includes('YOURNAME')) return [];

  let validatedUrl;
  try {
    validatedUrl = validateSubstackFeedUrl(feedUrl, expectedHost);
  } catch (error) {
    warn?.(`[pub-core] Rejected Substack feed URL (${error.message})`);
    return [];
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetchImpl(validatedUrl, {
      signal: controller.signal,
      redirect: 'manual',
    });
    if (res?.redirected || (res?.status >= 300 && res?.status < 400)) {
      warn?.('[pub-core] Rejected redirect from Substack feed');
      return [];
    }
    if (!res || !res.ok) {
      warn?.(`[pub-core] Substack feed unavailable (${res?.status || 'no response'})`);
      return [];
    }
    if (res.url) {
      validateSubstackFeedUrl(res.url, expectedHost);
    }

    const xml = await res.text();
    const parsed = parser.parse(xml);
    const channel = parsed?.rss?.channel || parsed?.feed || {};
    const items = asArray(channel.item || channel.entry);

    return items
      .map((item) => ({
        title: text(item.title),
        link: text(item.link),
        pubDate: text(item.pubDate || item.published || item.updated),
        description: text(item.description || item.summary),
      }))
      .filter((item) => item.title || item.link);
  } catch (error) {
    const reason = error?.name === 'AbortError' ? `timed out after ${timeoutMs}ms` : error?.message || error;
    warn?.(`[pub-core] Substack feed failed (${reason})`);
    return [];
  } finally {
    clearTimeout(timeout);
  }
}
