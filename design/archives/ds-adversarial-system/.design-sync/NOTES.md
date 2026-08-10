# Design-sync notes — The Adversarial System component library

## Setup gotchas
- Environment's cached Chromium is build `1194` (playwright `1.56.0`'s pin) — a
  fresh `npm i playwright` resolves a newer version whose `browsers.json` won't
  match; pin explicitly: `npm i playwright@1.56.0` then re-force
  `npm install playwright-core@1.56.0 --no-save` if npm still resolves a newer
  nested `playwright-core` (observed once in this environment).
- `[FONT_MISSING]` resolved by adding the same Google Fonts `@import` the live
  site (`sites/adversarial-system`) uses in `Base.astro` — this is intentionally
  a remote font-host import, not self-hosted, matching production today.

## Known render warns
- `[RENDER_THIN]` on `DocketRow` and `EssayHeader` — floor cards (unauthored
  previews), expected. Deliberately skipped authoring rich previews on this
  first sync (chose the "floor cards everywhere" scope for speed) — every
  component ships fully functional regardless; these two just show the
  typographic floor instead of a composed example. Authorable incrementally
  on any future sync.

## Re-sync risks
- Component set is intentionally minimal (9 components): Masthead, VolumeBar,
  Footer, Kicker, Button, EssayHeader, PullQuote, DocketRow, DropCapArticle.
  It mirrors the Astro site's `Base.astro` + essay/index page markup as of the
  brand-kit implementation pass — if those pages evolve (new motifs, new
  layout pieces), this package will drift unless someone ports the changes
  back here too. Nothing currently automates that sync in either direction.
- Fonts load via Google Fonts CDN, matching the site. If the site is ever
  changed to self-host fonts, update `src/styles.css` here to match (swap the
  `@import` for `cfg.extraFonts`).
- No authored previews yet — every component preview is either a real
  composed example or the honest floor card. Authoring richer previews is
  optional future work, not a defect.
