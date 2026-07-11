# Publishing Workspace

A two-publication system for **Just Asking Questions** and **The Adversarial System**.
Each publication has a designed website (the canonical home of every essay) and a
Substack (the email/distribution channel that carries a simplified version).

| Publication | Website | Substack |
| --- | --- | --- |
| Just Asking Questions | https://just-asking-questions.com | https://thomasjustaskingquestions.substack.com |
| The Adversarial System | https://theadversarialsystem.com | https://theadversarialsystem.substack.com |

`justaskingquestion.com` is also registered — point it at the JAQ Vercel project as a
redirect domain so the typo variant still lands.

## How the pieces fit

```
Claude design (claude.ai)          this repo                        the world
─────────────────────────  ──────────────────────────────  ─────────────────────────
brand kit  ──────────────▶  brand/tokens.json + tokens.css
page/essay designs ──────▶  src/layouts + src/components  ──▶  website (Vercel/Netlify)
essay text ──────────────▶  src/content/essays/*.md ────────▶  rendered on the site
                            scripts/substack-export.mjs ────▶  paste-ready Substack draft
                            (Substack RSS feed) ◀────────────  substack.com/feed
```

1. **Design in Claude.** Brand kits, page layouts, essay art direction — design them as
   Claude artifacts (HTML/CSS or React).
2. **Push the design into this repo.** Hand the artifact to Claude Code ("integrate this
   design into the Just Asking Questions site") and it becomes Astro layouts/components,
   with colors/fonts extracted into `brand/tokens.json` and `src/styles/tokens.css`.
3. **Write essays as markdown** in `sites/<publication>/src/content/essays/`. The site
   renders the full designed version.
4. **Export for Substack.** Run the export script to get a paste-ready version of the
   essay (text + flattened images + link back to the designed original):

   ```sh
   node scripts/substack-export.mjs sites/just-asking-questions/src/content/essays/my-essay.md
   ```

   Open the generated `.substack.html` in a browser, select all, copy, and paste into a
   new Substack draft. Substack preserves headings, images, quotes, and links.

## Layout

```
publishing/
  scripts/substack-export.mjs      markdown → paste-ready Substack HTML
  sites/
    just-asking-questions/         Astro site — canonical home of JAQ essays
      brand/tokens.json            brand kit values (from Claude design)
      src/styles/tokens.css        the same values as CSS custom properties
      src/content/essays/          essay markdown — the single source of truth
      src/layouts, src/components  the designed presentation layer
      src/lib/substack.js          pulls the Substack RSS feed at build time
    adversarial-system/            same structure for The Adversarial System
```

## Setup

Each site is a standard Astro project:

```sh
cd sites/just-asking-questions
npm install
npm run dev        # local preview at localhost:4321
npm run build      # static build in dist/
```

Set each site's Substack feed in its `.env` (see `.env.example`):

```
SUBSTACK_FEED_URL=https://thomasjustaskingquestions.substack.com/feed   # (per site — see each site's .env.example)
PUBLIC_SITE_URL=https://your-domain.com
```

## Brand kits

`brand/tokens.json` is the machine-readable brand kit; `src/styles/tokens.css` mirrors it
as CSS custom properties that every layout and component reads. When the Claude-designed
brand kit is finalized, update both files (or ask Claude Code to sync them) and the whole
site — and any social/Substack graphics generated from the tokens — updates with it.
