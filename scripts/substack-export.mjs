#!/usr/bin/env node
// Convert an essay markdown file into paste-ready HTML for the Substack editor.
//
//   node scripts/substack-export.mjs <path-to-essay.md> [--site-url https://example.com]
//
// Output: <essay>.substack.html next to the source file. Open it in a browser,
// select all, copy, paste into a new Substack draft. Only constructs Substack's
// editor preserves are emitted: headings, paragraphs, bold/italic, links, images,
// blockquotes, horizontal rules, and lists. Layout/interactive elements in the
// site version have no equivalent and are dropped — the canonical link covers that.

import { readFileSync, writeFileSync } from 'node:fs';
import { basename } from 'node:path';

const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith('--'));
if (!file) {
  console.error('usage: node scripts/substack-export.mjs <essay.md> [--site-url URL]');
  process.exit(1);
}
const siteUrlIdx = args.indexOf('--site-url');
const siteUrl = siteUrlIdx !== -1 ? args[siteUrlIdx + 1] : null;

const raw = readFileSync(file, 'utf8');

// --- frontmatter ---
let body = raw;
const fm = {};
const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n/);
if (fmMatch) {
  body = raw.slice(fmMatch[0].length);
  for (const line of fmMatch[1].split('\n')) {
    const m = line.match(/^(\w[\w-]*):\s*(.*)$/);
    if (m) fm[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

const esc = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// inline markdown → HTML (images, links, bold, italic, code)
function inline(s) {
  return esc(s)
    .replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, '<img src="$2" alt="$1">')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|\W)\*([^*]+)\*(?=\W|$)/g, '$1<em>$2</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');
}

const out = [];
const slug = basename(file).replace(/\.mdx?$/, '');
let canonical = fm.canonical || (siteUrl ? `${siteUrl.replace(/\/$/, '')}/essays/${slug}/` : null);
// UTM-tag the canonical link so site analytics attribute this traffic to the newsletter
if (canonical) canonical += `${canonical.includes('?') ? '&' : '?'}utm_source=substack&utm_medium=email&utm_campaign=${encodeURIComponent(slug)}`;

if (fm.title) out.push(`<h1>${inline(fm.title)}</h1>`);
if (canonical) {
  out.push(
    `<p><em>This essay is best experienced with its full design: <a href="${canonical}">read it on the site →</a></em></p>`,
    '<hr>'
  );
}

const lines = body.split('\n');
let para = [];
let list = null; // 'ul' | 'ol'
let quote = [];
let fence = null; // accumulating lines inside a ``` block

const flushPara = () => {
  if (para.length) out.push(`<p>${inline(para.join(' '))}</p>`);
  para = [];
};
const flushList = () => {
  if (list) out.push(`</${list}>`);
  list = null;
};
const flushQuote = () => {
  if (quote.length) out.push(`<blockquote><p>${inline(quote.join(' '))}</p></blockquote>`);
  quote = [];
};

for (const line of lines) {
  const t = line.trim();

  if (fence !== null) {
    if (t.startsWith('```')) {
      out.push(`<pre><code>${esc(fence.join('\n'))}</code></pre>`);
      fence = null;
    } else fence.push(line);
    continue;
  }
  if (t.startsWith('```')) {
    flushPara(); flushList(); flushQuote();
    fence = [];
    continue;
  }

  const h = t.match(/^(#{1,4})\s+(.*)/);
  const li = t.match(/^([-*]|\d+\.)\s+(.*)/);

  if (!t) { flushPara(); flushList(); flushQuote(); continue; }
  if (h) {
    flushPara(); flushList(); flushQuote();
    const level = Math.min(h[1].length + 1, 4); // demote: essay title is the h1
    out.push(`<h${level}>${inline(h[2])}</h${level}>`);
  } else if (/^(---|\*\*\*)$/.test(t)) {
    flushPara(); flushList(); flushQuote();
    out.push('<hr>');
  } else if (t.startsWith('>')) {
    flushPara(); flushList();
    quote.push(t.replace(/^>\s?/, ''));
  } else if (li) {
    flushPara();
    const kind = /^\d+\./.test(li[1]) ? 'ol' : 'ul';
    if (list !== kind) { flushList(); out.push(`<${kind}>`); list = kind; }
    out.push(`<li>${inline(li[2])}</li>`);
  } else {
    flushList(); flushQuote();
    para.push(t);
  }
}
flushPara();
flushList();
flushQuote();
if (fence !== null) out.push(`<pre><code>${esc(fence.join('\n'))}</code></pre>`);

if (canonical) out.push('<hr>', `<p><em><a href="${canonical}">Read the fully designed version →</a></em></p>`);

const html = `<!doctype html><meta charset="utf-8"><title>${esc(fm.title || slug)} — Substack export</title>
<body style="max-width:42em;margin:2em auto;font-family:Georgia,serif;line-height:1.6">
${out.join('\n')}
</body>`;

const dest = file.replace(/\.mdx?$/, '.substack.html');
writeFileSync(dest, html);
console.log(`wrote ${dest}`);
console.log('open it in a browser, select all, copy, and paste into a Substack draft.');
