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

export async function fetchSubstackPosts(feedUrl, options = {}) {
  const {
    timeoutMs = 8000,
    fetchImpl = fetch,
    warn = console.warn,
  } = options;

  if (!feedUrl || feedUrl.includes('YOURNAME')) return [];

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetchImpl(feedUrl, { signal: controller.signal });
    if (!res || !res.ok) {
      warn?.(`[pub-core] Substack feed unavailable: ${feedUrl} (${res?.status || 'no response'})`);
      return [];
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
    warn?.(`[pub-core] Substack feed failed: ${feedUrl} (${reason})`);
    return [];
  } finally {
    clearTimeout(timeout);
  }
}
