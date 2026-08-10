# Just Asking Questions — component conventions

## Setup
No provider/wrapper is required — this system has no React context. Theme
switching is done by setting `data-theme="light"` or `data-theme="dark"` on
the page's root `<html>` element (plain CSS custom-property swap, not React
state). `Masthead` takes `theme` and `onToggleTheme` as plain props for the
toggle button — the caller owns the actual `data-theme` switch.

Wrap page content in an element with class `jaq-root` so background/color and
`::selection` styling inherit from the token system.

## Styling idiom
This is a **CSS custom-property + fixed class-per-component** system — never
invent new utility classes or add a second chromatic color; oxblood
(`--accent`) is the *only* saturated color in the entire system, used
sparingly (the mark, one rule, one hover state). Everything else is paper
and ink.

**Tokens** (`var(--*)`, swap by `data-theme`): `--background` (page bg),
`--panel` (card/panel bg, "the parchment"), `--ink` (primary text),
`--muted` (secondary text), `--faint` (tertiary/metadata text), `--accent`
(oxblood — the mark, pull-quote borders, hover states, primary buttons),
`--hairline` / `--hairline-strong` (borders). Fonts: `--font-display` (EB
Garamond — headlines, the mark's glyph, pull quotes, lockups; weight 500),
`--font-body` (Newsreader — running body copy, optical-size variable),
`--font-mono` (IBM Plex Mono — "the clerk's hand": kickers, dates, bylines,
captions, buttons; uppercase, letter-spaced `.1em`–`.28em`).

**Component classes**: `jaq-masthead`, `jaq-lockup`, `jaq-footer`,
`jaq-btn`/`jaq-btn--primary`, `jaq-essay-header`, `jaq-pull-quote`,
`jaq-essay-list-item`, `jaq-drop-cap`, `jaq-mark`/`jaq-mark--ring`. Use the
exported components for these; `jaq-root`/`jaq-drop-cap` are the only classes
meant to wrap arbitrary children directly.

**The mark is the whole brand.** `PercontationMark` renders a reversed
question mark (`?` mirrored) in EB Garamond 500 — a 16th-century printer's
mark for a rhetorical question asked by someone who already knows the
answer. Use `variant="ring"` (circled, in the masthead lockup) or
`variant="bare"` (uncircled, larger, in the footer or as a section-break
ornament). Never use it as a watermark or repeat it more than once per
surface — clear space equals the height of the wordmark's "T" on all sides.

**Hard system rules:**
- Border radius is `0` everywhere except the mark's own ring.
- No `box-shadow`.
- Links: ink at rest, oxblood on hover, with a visible underline
  (`border-bottom`) that appears only on hover — never a default
  text-decoration underline at rest.
- Voice on the page matches the essays: precise, evidentiary, unhurried —
  design copy in this system should read like a lawyer's voice, not
  marketing copy.

## Where the truth lives
`styles.css` at the bundle root is the full token/class definition. Per-
component `.prompt.md` files document each component's props.

## Example
```tsx
<div className="jaq-root">
  <Masthead theme="light" onToggleTheme={() => {}} subscribeHref="#" />
  <main style={{ maxWidth: 660, margin: '0 auto', padding: '3rem 1.5rem' }}>
    <EssayHeader title="The Record, Such As It Is" dek="I want to be precise about what happened next." byline="Thomas M. Just · July 12, 2026" />
    <div className="jaq-drop-cap">
      <p>That is a fair question, and I owe the record an answer...</p>
    </div>
    <PullQuote>The irony lives in the mark, not the prose.</PullQuote>
  </main>
  <Footer />
</div>
```
