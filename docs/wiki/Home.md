# Publishing internal wiki

This repository is the ship surface for two publications: **Just Asking Questions** (JAQ) and **The Adversarial System** (TAS). Each has a designed Astro website — the canonical home of every essay — and a Substack for email and distribution. It is not a design-system playground, not a CMS product, and not where essay ideas are born.

This wiki is the internal handbook. It orients operators and agents. It does not replace `README.md`, `CLAUDE.md`, or a file under `docs/`. If this page and a governing document disagree, the governing document wins.

Living checkout: [`https://github.com/thomasjustesq-dev/publishing`](https://github.com/thomasjustesq-dev/publishing). Canonical disk path: `/Volumes/Crucial X8/GitHub/publishing`. The copy on `main` at `ad36232` (2026-08-19, fleet grok-4.6 preflight) is the snapshot this handbook was filled from.

## Current posture, in one paragraph

The monorepo product is closed. Both sites are live on Vercel, Decap production OAuth is live (JAQ hosts the GitHub OAuth App for both admin UIs), and seed essays are published: six on JAQ, one TAS charter. `docs/ASSIGNMENT.md` is empty. Ongoing work is writing and shipping essays, not reviving archived React kits or inventing a third publication. TAS Substack still has no posts; `npm run import:substack -- --site tas` is a no-op until that feed exists.

Read [Current status](Current-Status.md) before doing work. Read [Traps](Traps.md) before touching brand, CMS, or deploy.

## How to use this wiki

If you are an agent opening the repo for the first time, start at [Start here](Start-Here.md). If you are about to change a site, package, or Vercel config, read [Architecture](Architecture.md) and [Operating rules](Operating-Rules.md). If you are writing or importing an essay, stay in `sites/<publication>/src/content/essays/` and run the publishing loop in the README.

Canonical copy: [`docs/wiki/`](https://github.com/thomasjustesq-dev/publishing/tree/main/docs/wiki). The GitHub Wiki tab is the same handbook once initialized. GitHub does not create `publishing.wiki.git` until a logged-in user clicks “Create the first page” once; after that, `scripts/publish_wiki.sh` pushes this tree. Do not let a wiki page become a second living spec.

## Document authority

1. `README.md` — product surface, ship loop, env, deploy.
2. `CLAUDE.md` — agent contract. `AGENTS.md`, `GEMINI.md`, `.cursorrules`, and `.github/copilot-instructions.md` redirect here; do not copy rules into those files.
3. `docs/ASSIGNMENT.md` — the only self-serve work menu. Empty slot means do not self-select from `docs/ROADMAP.md`.
4. `docs/WORKBOARD.md` — claim-first, write surfaces, path classes.
5. `docs/DECISIONS.md` — append-only product and process decisions.
6. This wiki — orientation.

## What this wiki is not

It is not a claim on a worktree. It is not permission to revive `design/archives/`. It is not a place to store OAuth secrets, Vercel tokens, or Substack session cookies. Essay ideas do not start here; capture them in the vault note `Writing/Idea Hopper.md` first.
