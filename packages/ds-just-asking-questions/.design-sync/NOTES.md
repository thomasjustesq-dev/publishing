# Design-sync notes — Just Asking Questions component library

## Setup gotchas
- Same playwright/chromium pin issue as the sibling TAS package: this
  environment's cached Chromium is build `1194`, matching playwright
  `1.56.0` exactly. If `npm i playwright` resolves a newer version, force
  `npm install playwright-core@1.56.0 --no-save` afterward.
- `[FONT_REMOTE]` on EB Garamond/Newsreader/IBM Plex Mono is expected — the
  same Google Fonts CDN import the live site (`sites/just-asking-questions`)
  uses in `Base.astro`, not a self-hosting gap.

## Target project
- Synced into the pre-existing "Design System" project
  (f4fbded4-9fe6-4655-bf84-cfb7d232dce3), re-adopted rather than created
  fresh — it already held JAQ brand reference docs (mark/, imagery/, voice/,
  foundations/, editorial/, social/) from earlier Claude Design work, likely
  unrelated to a design-sync upload (no _ds_sync.json / components/ shape).
  Those files were reviewed via list_files before upload and are untouched
  by this sync's writes/deletes — only the design-sync bundle's own paths
  (`components/`, `_vendor/`, `_ds_bundle.*`, `styles.css`, `README.md`,
  `_ds_sync.json`) are managed by future re-syncs.

## Known render warns
- `[RENDER_THIN]` on `EssayHeader` — floor card (unauthored preview),
  expected; fully functional, just not composed with example content yet.

## Re-sync risks
- Component set (8): PercontationMark, Masthead, Footer, Button,
  EssayHeader, PullQuote, EssayListItem, DropCapArticle — mirrors the Astro
  site's `Base.astro` + index/essay page markup as of the brand-kit
  implementation pass. If those pages evolve, this package drifts unless
  someone ports the changes back here.
- No authored previews yet (floor-card scope chosen for speed on this first
  sync) — authorable incrementally on any future sync.
- The reused "Design System" project's pre-existing reference docs
  (mark/imagery/voice/etc.) are NOT part of this package's managed file set
  — don't assume a future re-sync's delete-reconciliation pass touches them;
  it only reconciles paths this build produces (components/, _vendor/, etc.).
