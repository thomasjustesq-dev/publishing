# Publishing Workspace

Two publications, one monorepo: **Just Asking Questions** and **The Adversarial System**.
Each has a designed Astro website (canonical home of every essay) and a Substack
(email/distribution channel with a simplified paste).

| Publication | Website | Substack | Dev |
| --- | --- | --- | --- |
| Just Asking Questions | https://just-asking-questions.com | https://thomasjustaskingquestions.substack.com | `npm run dev:jaq` → :4321 |
| The Adversarial System | https://theadversarialsystem.com | https://theadversarialsystem.substack.com | `npm run dev:tas` → :4322 |

`justaskingquestion.com` is also registered — point it at the JAQ Vercel project as a
redirect domain so the typo variant still lands.

## Architecture

```
packages/
  pub-core/      shared Substack feed fetch, export renderer, JSON-LD helper
  site-kit/      shared essay schema, CSP, Vercel config, site-config helpers
sites/
  just-asking-questions/   Astro site (brand tokens + layouts)
  adversarial-system/      Astro site (brand tokens + layouts)
design/archives/           archived React design-sync kits (reference only, not built)
scripts/                   content checks, Substack export, essay scaffold, vercel sync
```

**Astro-first.** Live UI is each site’s Astro layouts/pages. React design-system packages
were archived under `design/archives/` — brand truth is `brand/tokens.json` +
`src/styles/tokens.css`.

**Single lockfile.** Install only from the monorepo root. Site `package-lock.json` files
are intentionally gone. Vercel Root Directory is still `sites/<name>`; install runs
`cd ../.. && npm ci` (see each site’s `vercel.json`, generated from site-kit).

## Setup

Node.js **22.12+** (see `.nvmrc`).

```sh
npm install
npm run check          # content + tokens + unit tests
npm run build          # both sites
npm run dev:jaq        # localhost:4321
npm run dev:tas        # localhost:4322
```

Per-site env (copy from each site’s `.env.example`):

```
SUBSTACK_FEED_URL=https://…substack.com/feed
PUBLIC_SITE_URL=https://your-domain.com
```

## Publishing loop

1. Scaffold a draft:

   ```sh
   npm run new-essay -- --site jaq --slug my-essay --title "My Essay"
   ```

2. Write in `sites/<publication>/src/content/essays/<slug>.md`. Set `draft: false` and a
   `description` when ready.

3. Validate:

   ```sh
   npm run check
   REQUIRE_PUBLISHED_ESSAYS=1 npm run check   # fail if a site has zero live essays
   ```

4. Export for Substack:

   ```sh
   npm run export:substack -- sites/just-asking-questions/src/content/essays/my-essay.md \
     --site-url https://just-asking-questions.com --stdout
   ```

5. After the Substack post is live:

```sh
npm run set-substack-url -- --site jaq --slug my-essay --url https://…substack.com/p/…
```

6. Full gate before push:

```sh
npm run publish:check
```

Drafts: visible in local `dev` and when `PUBLIC_SHOW_DRAFTS=1` (Vercel Preview only — never Production). RSS is always published-only.

Deploy: **git push to main** (Vercel Root Directory `sites/<name>`). Do not `vercel --prod` from a site subdirectory.

### Images

```sh
npm run optimize:images -- --site jaq   # re-compress public/essays heroes to WebP
```

Heroes over 1.5 MB fail `npm run check`. Import auto-optimizes downloads.

### Import existing Substack posts

```sh
npm run import:substack -- --site jaq
npm run import:substack -- --site tas
npm run import:substack -- --site jaq --slug the-stoicism-question
```

Pulls public post HTML from Substack’s API, converts to markdown, downloads covers/images
into `public/essays/<slug>/`, and writes published essays with `substackUrl`. Skips
`coming-soon`. Paid posts import the free teaser only. TAS is empty until that Substack
has posts.

Samples stay in `sites/<publication>/examples/` — not in the published collection.

## Deploy (Vercel)

Each publication is its own Vercel project (already linked under `sites/*/.vercel/` locally):

| Setting | Value |
| --- | --- |
| Root Directory | `sites/just-asking-questions` or `sites/adversarial-system` |
| Install | `cd ../.. && npm ci` (from `vercel.json`) |
| Build | `npm run build` |
| Output | `dist` |
| Env | `PUBLIC_SITE_URL`, `SUBSTACK_FEED_URL` |

Domains: production hostname on each project; add `justaskingquestion.com` as a redirect
alias on JAQ. After changing CSP/headers in site-kit, run `npm run sync:vercel` and commit
the regenerated `vercel.json` files.

## Brand kits

`brand/tokens.json` is the machine-readable brand kit; `src/styles/tokens.css` mirrors it
as CSS custom properties. Fonts are self-hosted (`src/styles/fonts.css` + `@fontsource/*`).
`npm run check` verifies token coverage.

## Package scope

Live workspace packages use the `@pub/*` scope (`@pub/core`, `@pub/site-kit`). Publication
sites keep short unscoped names (`just-asking-questions`, `adversarial-system`).


## Essay frontmatter

| Field | Required | Notes |
| --- | --- | --- |
| `title` | yes | |
| `description` | published | |
| `date` | yes | not future |
| `draft` | no | default false |
| `format` | no | `essay` \| `podcast` \| `video` \| `teaser` |
| `paywalled` | no | teaser requires `substackUrl` |
| `hero` / `heroAlt` | no | public path; size-budgeted |
| `substackUrl` | no | after Substack publish |
| `tags` | no | powers `/tags/` |
| `audioUrl` / `videoUrl` | no | external link-outs |
| `imported` / `importSource` | no | Substack import metadata |
