import matter from 'gray-matter';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const schema = {
  ...defaultSchema,
  tagNames: [
    'h1', 'h2', 'h3', 'h4',
    'p', 'a', 'img', 'blockquote', 'hr',
    'ul', 'ol', 'li', 'strong', 'em', 'code', 'pre',
  ],
  attributes: {
    ...defaultSchema.attributes,
    a: [...(defaultSchema.attributes?.a || []), 'href', 'title'],
    img: [...(defaultSchema.attributes?.img || []), 'src', 'alt', 'title'],
    code: [...(defaultSchema.attributes?.code || []), 'className'],
  },
};

function demoteHeadings() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      const match = /^h([1-6])$/.exec(node.tagName || '');
      if (match) node.tagName = `h${Math.min(Number(match[1]) + 1, 4)}`;
    });
  };
}

function absolutizeUrls(siteUrl) {
  return (tree) => {
    if (!siteUrl) return;
    const base = siteUrl.endsWith('/') ? siteUrl : `${siteUrl}/`;
    visit(tree, 'element', (node) => {
      const attr = node.tagName === 'a' ? 'href' : node.tagName === 'img' ? 'src' : null;
      if (!attr) return;
      const value = node.properties?.[attr];
      if (!value || typeof value !== 'string') return;
      if (/^(#|mailto:|tel:)/i.test(value)) return;
      try {
        node.properties[attr] = new URL(value, base).toString();
      } catch {
        // Leave malformed URLs untouched rather than failing the export.
      }
    });
  };
}

function withUtm(url, slug) {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}utm_source=substack&utm_medium=email&utm_campaign=${encodeURIComponent(slug)}`;
}

export async function renderSubstackExport(raw, options = {}) {
  const { slug = 'essay', siteUrl = null } = options;
  const { data: frontmatter, content: body } = matter(raw);

  const canonicalBase = frontmatter.canonical ||
    (siteUrl ? `${siteUrl.replace(/\/$/, '')}/essays/${slug}/` : null);
  const canonical = canonicalBase ? withUtm(canonicalBase, slug) : null;

  const rendered = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(demoteHeadings)
    .use(absolutizeUrls, siteUrl)
    .use(rehypeSanitize, schema)
    .use(rehypeStringify)
    .process(body);

  const out = [];
  if (frontmatter.title) out.push(`<h1>${escapeHtml(frontmatter.title)}</h1>`);
  if (canonical) {
    out.push(
      `<p><em>This essay is best experienced with its full design: <a href="${canonical}">read it on the site →</a></em></p>`,
      '<hr>',
    );
  }

  out.push(String(rendered).trim());

  if (canonical) {
    out.push('<hr>', `<p><em><a href="${canonical}">Read the fully designed version →</a></em></p>`);
  }

  const title = frontmatter.title || slug;
  return `<!doctype html><meta charset="utf-8"><title>${escapeHtml(title)} — Substack export</title>\n<body style="max-width:42em;margin:2em auto;font-family:Georgia,serif;line-height:1.6">\n${out.filter(Boolean).join('\n')}\n</body>`;
}
