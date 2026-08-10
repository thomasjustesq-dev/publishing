# Design-system archives

React component libraries originally generated via Claude Design design-sync for
**Just Asking Questions** and **The Adversarial System**.

## Why archived

The live publications are **Astro-first**. Presentation lives in each site's
`src/layouts`, `src/pages`, and `src/styles`. Shipping a parallel React package
that the sites never imported created dual sources of truth, CI cost, and React
version skew without product benefit.

These trees are kept as **brand/export reference** only. They are not npm
workspaces, not built by CI, and not published.

## Authority

| Layer | Source of truth |
| --- | --- |
| Brand values | `sites/<publication>/brand/tokens.json` |
| CSS tokens | `sites/<publication>/src/styles/tokens.css` |
| Live UI | Astro layouts / pages under `sites/<publication>/` |
| Shared logic | `packages/pub-core`, `packages/site-kit` |

If a future product needs React (e.g. interactive embeds), rehydrate from here
deliberately — do not silently re-add these packages to the workspace.
