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
                            packages/pub-core ─────────────▶  RSS + Substack export
                            scripts/substack-export.mjs ───▶  paste-ready Substack draft
                            (Substack RSS feed) ◀────────────  substack.com/feed
```

1. **Design in Claude.** Brand kits, page layouts, essay art direction — design them as
   Claude artifacts (HTML/CSS or React).
2. **Push the design into this repo.** Hand the artifact to Claude Code ("integrate this
   design into the Just Asking Questions site") and it becomes Astro layouts/components,
   with colors/fonts extracted into `brand/tokens.json` and `src/styles/tokens.css`.
3. **Write essays as markdown** in `sites/<publication>/src/content/essays/`. The site
   renders the full designed version. Sample essays live in `sites/<publication>/examples/`;
   copy one into `src/content/essays/` only when you want to preview the pipeline locally.
4. **Validate content.** Run the content check before publishing:

   ```sh
   node scripts/check-content.mjs
   ```

   It validates frontmatter, URLs, hero image paths, future dates, and placeholder text.
   Set `REQUIRE_PUBLISHED_ESSAYS=1` when a publication must have at least one live essay.
5. **Export for Substack.** Run the export script to get a paste-ready version of the
   essay (text + flattened images + link back to the designed original):

   ```sh
   node scripts/substack-export.mjs sites/just-asking-questions/src/content/essays/my-essay.md \
     --site-url https://just-asking-questions.com --stdout
   ```

   Without `--stdout`, it writes `<essay>.substack.html` next to the source file. Open the
   generated file in a browser, select all, copy, and paste into a new Substack draft.

## Layout

```
publishing/
  package.json                    npm workspace root + repo-wide scripts
  scripts/check-content.mjs       essay frontmatter/publication validation
  scripts/substack-export.mjs     markdown → paste-ready Substack HTML CLI
  packages/
    pub-core/                     shared RSS fetch + Substack export renderer
    ds-adversarial-system/        React design-system package for TAS
    ds-just-asking-questions/     React design-system package for JAQ
  sites/
    just-asking-questions/        Astro site — canonical home of JAQ essays
      brand/tokens.json           brand kit values (from Claude design)
      src/styles/tokens.css       the same values as CSS custom properties
      src/content/essays/         published essay markdown
      examples/welcome.md         sample essay kept out of the published collection
      src/layouts, src/components the designed presentation layer
    adversarial-system/           same structure for The Adversarial System
```

## Setup

Use Node.js 22.12 or newer, then use the workspace root for repo-wide checks and
builds; each site remains a standard Astro project that can also be developed on its own:

```sh
npm install
npm run dev:jaq      # Just Asking Questions at localhost:4321
npm run dev:tas      # The Adversarial System at localhost:4321
npm run build        # build both design-system packages and both sites
npm run check        # content validation + pub-core tests
```

Set each site's Substack feed in its `.env` (see `.env.example`):

```
SUBSTACK_FEED_URL=https://thomasjustaskingquestions.substack.com/feed   # per site
PUBLIC_SITE_URL=https://your-domain.com
```

Deployment note: the Astro sites are self-contained and can deploy from their site
subdirectories; each site keeps its own `package-lock.json` for standalone Vercel
builds. The workspace root is only required for repo-wide checks, design-system
packaging, and the Substack export CLI.

## Brand kits

`brand/tokens.json` is the machine-readable brand kit; `src/styles/tokens.css` mirrors it
as CSS custom properties that every layout and component reads. When the Claude-designed
brand kit is finalized, update both files (or ask Claude Code to sync them) and the whole
site — and any social/Substack graphics generated from the tokens — updates with it.
