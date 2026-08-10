import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { siteConfig } from '../site.config.js';
import { publishedOnly } from '../lib/essays.js';

export async function GET(context) {
  const essays = (await getCollection('essays', publishedOnly))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: siteConfig.name,
    description: siteConfig.description,
    site: context.site,
    items: essays.map((essay) => ({
      title: essay.data.title,
      description: essay.data.description,
      pubDate: essay.data.date,
      link: `/essays/${essay.id}/`,
    })),
  });
}
