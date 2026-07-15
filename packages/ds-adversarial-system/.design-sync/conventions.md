# The Adversarial System — component conventions

## Setup
No provider/wrapper is required — this system has no React context. Theme
switching is done by setting `data-theme="light"` or `data-theme="dark"` on
the page's root `<html>` element (plain CSS custom-property swap, not a
React state tree). `Masthead` takes `theme` and `onToggleTheme` as plain
props for the toggle button's icon and click handler — the actual switching
of `data-theme` is the caller's responsibility.

Wrap page content in an element with class `tas-root` so `background`/`color`
inherit from the token system rather than the browser default.

## Styling idiom
This is a **CSS custom-property + fixed class-per-component** system — never
invent new utility classes or inline arbitrary colors. Two vocabularies:

**Tokens** (`var(--*)`, defined in `styles.css`, swap value by `data-theme`):
`--paper` (page bg), `--ink` (headlines/primary text), `--body`/`--body2`/`--body3`
(copy, in descending emphasis), `--muted`/`--muted2` (metadata), `--line`
(hairline borders), `--accent` (the ONLY chromatic color — red, used for CTAs,
kickers, links, active states — never introduce a second accent hue),
`--paper-glass` (sticky-header blur backdrop), `--panel` (slightly-off-paper
card bg). Fonts: `--font-display` (Instrument Serif — headlines, pull quotes
only), `--font-body` (Spectral — running copy), `--font-mono` (IBM Plex Mono —
ALL metadata: labels, dates, kickers, bylines, buttons, nav; always uppercase,
letter-spaced `.14em`–`.24em`).

**Component classes** (fixed, one per component, do not compose ad hoc):
`tas-masthead`, `tas-footer`, `tas-kicker`, `tas-btn`/`tas-btn--primary`/
`tas-btn--secondary`, `tas-essay-header`, `tas-pull-quote`, `tas-docket-row`,
`tas-drop-cap`, `tas-volume-bar`, `tas-rule-double`. Use the exported
components for these, not raw divs with these classes, except `tas-root` /
`tas-drop-cap` which are layout wrappers around arbitrary children.

**Hard system rules — treat any violation as a bug:**
- Border radius is `0` everywhere. No rounded corners, ever.
- No `box-shadow`. Depth comes only from `1px solid var(--line)` borders and
  the double-rule motif (`tas-rule-double`: a thick top rule directly above a
  thin bottom rule, 3–5px apart) — use that motif for section breaks, not a
  plain `<hr>`.
- The mono/serif split is absolute: anything that is a claim, headline, or
  quote is `--font-display` or `--font-body`; anything that is structural
  metadata (numbers, dates, labels, status) is `--font-mono`, uppercase,
  tracked out. Never set a headline in mono or a byline in serif.
- Kickers precede headings, always in the small tracked-mono accent style —
  compose as `№ 001 · AI & Evidence · Essay` / `01 / Sourcing` patterns.

## Where the truth lives
`styles.css` at the bundle root is the full token/class definition — read it
before styling anything new. Per-component `.prompt.md` files (in
`components/general/<Name>/`) document each component's props.

## Example
```tsx
<div className="tas-root">
  <Masthead wordmarkSrc="/brand/wordmark-primary.png" theme="light" onToggleTheme={() => {}} subscribeHref="#" />
  <main style={{ maxWidth: 1200, margin: '0 auto', padding: '2.5rem 32px' }}>
    <EssayHeader kicker="№ 004 · Networks & Systems · Essay" title="The Seam" dek="Where machine judgment meets human accountability, someone has to hold the line." byline="Thomas M. Just · July 12, 2026" />
    <div className="tas-drop-cap">
      <p>The record, such as it is, begins with a question nobody wanted to ask aloud...</p>
    </div>
    <PullQuote>The seam is not a flaw in the system. It is the system.</PullQuote>
  </main>
  <Footer />
</div>
```
