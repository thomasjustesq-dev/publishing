# Architecture

Publishing is a Node 22 npm workspaces monorepo. Two Astro sites share product code. Presentation is Astro-only. There is no ORM, no separate CMS database, and no live React design-system package.

## Repository map

```text
packages/
  pub-core/                 Substack feed fetch, export renderer, JSON-LD helper
  site-kit/                 Essay schema, CSP, Vercel config, draft filters, site-config
  site-ui/                  Re-exports of site-kit logic (no brand chrome)
sites/
  just-asking-questions/    JAQ Astro site (brand tokens + layouts)
  adversarial-system/       TAS Astro site (brand tokens + layouts)
design/archives/            Archived React design-sync kits — reference only, not built
docs/                       Coordination, CMS, decisions, roadmap
docs/wiki/                  This handbook (also published to GitHub Wiki)
scripts/                    Content checks, Substack import/export, essay scaffold, Vercel sync
```

Live workspace packages use `@pub/*` (`@pub/core`, `@pub/site-kit`, `@pub/site-ui`). Publication sites keep short unscoped names (`just-asking-questions`, `adversarial-system`).

## Two publications, one git tree

| | JAQ | TAS |
| --- | --- | --- |
| Site id | `jaq` | `tas` |
| Tagline | No verdicts withheld | Writing from the edge of AI, security, and liberty |
| Dev | `npm run dev:jaq` → :4321 | `npm run dev:tas` → :4322 |
| Content | `sites/just-asking-questions/src/content/essays/` | `sites/adversarial-system/src/content/essays/` |
| Brand | `sites/.../brand/tokens.json` + `src/styles/tokens.css` | same shape, different tokens |

Cowork thinking folders `Projects/Just Asking Questions/` and `Projects/The Adversarial System/` are vault indexes, not this tree.

## Data flow (essay)

1. Idea is captured in vault `Writing/Idea Hopper.md`.
2. `npm run new-essay` writes markdown under `sites/<publication>/src/content/essays/<slug>.md`.
3. Author in git (or Decap `/admin/`). Samples stay in `sites/<publication>/examples/` — not the published collection.
4. `draft: false` plus a `description` when ready. Heroes live under `public/essays/<slug>/`; over 1.5 MB fails `npm run check`.
5. `npm run check` / `npm run publish:check`. Push to `main`. Vercel builds from the site Root Directory with install `cd ../.. && npm ci`.
6. Substack is distribution: export, paste, then `set-substack-url`. Canonical URL is the Astro site.

Drafts are visible in local `dev` and when `PUBLIC_SHOW_DRAFTS=1` (Vercel Preview only). RSS and Pagefind index published essays only.

## Deploy

Each publication is its own Vercel project. Root Directory is `sites/just-asking-questions` or `sites/adversarial-system`. After changing CSP/headers in `@pub/site-kit`, run `npm run sync:vercel` and commit both regenerated `vercel.json` files. Do not deploy from a site subdirectory with the Vercel CLI.

## CMS

Git-backed Decap. Local: `decap-server` on 8081 when the admin UI is on localhost. Production: serverless `/api/auth` + `/api/callback`. One GitHub OAuth App, one callback URL, so both CMS configs use `base_url: https://www.just-asking-questions.com`. TAS admin still works; the login popup hits JAQ and the callback `postMessage` allows both www origins. Commits land on `main` with `content(jaq|tas): …` messages. Details: `docs/CMS.md`.

## Stack

Node 22.12+, npm workspaces, Astro, Pagefind after each site build, Zod 4 at the root test helper (`astro/zod` still for content collections), sharp/WebP for heroes, self-hosted `@fontsource` fonts. Hosted GitHub Actions only (`ubuntu-*`, `macos-*`, `windows-*`). Never `runs-on: self-hosted`.

## What is out of the pipeline

React design-system packages. A second lockfile under `sites/`. Google Fonts (CSP). Netlify Identity. A third hostname treated as a real site. Notebooks. LLM “rewrite this essay into the brand voice” as a merge-ready body.
