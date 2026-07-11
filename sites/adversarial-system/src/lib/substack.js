// Fetch this publication's Substack RSS feed at build time. No auth, no API —
// every Substack exposes /feed publicly. Returns [] if the feed is unset or down
// so the site still builds.
export async function fetchSubstackPosts() {
  const feedUrl = import.meta.env.SUBSTACK_FEED_URL || process.env.SUBSTACK_FEED_URL || 'https://theadversarialsystem.substack.com/feed';
  if (!feedUrl || feedUrl.includes('YOURNAME')) return [];
  try {
    const res = await fetch(feedUrl);
    if (!res.ok) return [];
    const xml = await res.text();
    return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(([, item]) => ({
      title: extract(item, 'title'),
      link: extract(item, 'link'),
      pubDate: extract(item, 'pubDate'),
      description: extract(item, 'description'),
    }));
  } catch {
    return [];
  }
}

function extract(block, tag) {
  const m = block.match(new RegExp(`<${tag}>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${tag}>`));
  return m ? m[1].trim() : '';
}
