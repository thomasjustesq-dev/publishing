# Contributing

Full text: [`CONTRIBUTING.md`](https://github.com/thomasjustesq-dev/publishing/blob/main/CONTRIBUTING.md). This page is the agent-facing short form plus wiki hygiene.

## Setup

```sh
npm install          # monorepo root only — no site-level locks
npm run check
npm run build
```

Node 22.12+ (`.nvmrc` is `22`).

## Workflow

1. Read `docs/ASSIGNMENT.md` and `docs/LIVE_CLAIMS.md`. Claim-first for product work (`scripts/claim-open.sh`). Owner-directed docs-process may use a `docs/*` or `process/*` branch; do not steal an overlapping Active claim.
2. Branch from `origin/main`. Worktrees: `/Volumes/Crucial X8/GitHub/publishing-worktrees/<name>`.
3. Make the smallest change that solves the problem. Stay inside the write surface.
4. Essays live in `sites/<publication>/src/content/essays/`. Samples stay in `sites/<publication>/examples/`.
5. Scaffold: `npm run new-essay -- --site jaq|tas --slug kebab --title "Title"`.
6. After Substack publish, set `substackUrl` and re-run checks.
7. If you change CSP/headers in `@pub/site-kit`, run `npm run sync:vercel` and commit both sites’ `vercel.json`.

## Pull requests

Explain what changed and why. Include `npm run check` and `npm run build` output for product changes. Docs-only PRs do not need a site build.

Do not commit `dist/`, `node_modules/`, `.env*`, `*.substack.html`, or `.DS_Store`. Do not tick the PR template’s design-system artifact checkbox — those packages are archived.

Never push directly to `main`. Hosted CI only. Never `runs-on: self-hosted`.

## Wiki maintenance

Edit `docs/wiki/` on a branch. After the Wiki tab exists, run `scripts/publish_wiki.sh` so `_Sidebar.md`, `_Footer.md`, and the page files land on `publishing.wiki.git`. Do not let the Wiki tab drift from `docs/wiki/`. Do not put OAuth secrets, Vercel tokens, or Substack session cookies in wiki pages. Pin a `main` SHA in Home and Current status when you refresh posture.

In-repo pages use `.md` links so GitHub’s tree view works. The publish script rewrites those to GitHub Wiki page names.

## Coordination

Read `Projects/Claude Code/_Live.md` and the publishing briefing before writing. Register your glob. Claim-first exists in this repo; `docs/claims/` on `main` is the registry other agents read. One live claim per tool. Known limits (`docs/KNOWN_LIMITS.md`): coordination does not stop agents who never open a claim (P1); write-surface check is `agent/*` only (P2).
