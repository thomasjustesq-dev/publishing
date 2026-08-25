# Traps

Durable traps from the repo briefing, `TODO.md`, and process lessons. If you learn a new one, write it here and on `Projects/Claude Code/publishing.md`.

## The path is not `GitHub/Projects/publishing`

Canonical checkout is `/Volumes/Crucial X8/GitHub/publishing`. `TODO.md` still says `GitHub/Projects/publishing`. That directory does not exist. A “missing repo” is usually an unmounted X8, not a deleted project.

## Essay ideas do not start here

Capture in vault `Writing/Idea Hopper.md` first. Opening a blank markdown file in `src/content/essays/` because the agent is already in the repo skips the hopper and duplicates Cowork indexes.

## Vault Cowork folders are not the git tree

`Projects/Just Asking Questions/` and `Projects/The Adversarial System/` are vault/Cowork indexes. Do not clone, commit, or “sync” them into this monorepo.

## Do not revive the React design system

`design/archives/ds-just-asking-questions` and `ds-adversarial-system` are dead. Sites never imported them; dual UI sources drifted. The PR template still asks for `dist/index.es.js` design-system artifacts — that checkbox is stale. Ignore it. Brand truth is `brand/tokens.json` + `src/styles/tokens.css`.

## Single lockfile, or Vercel fights you

Install only from the monorepo root. Site `package-lock.json` files were removed on purpose. Vercel Root Directory is still `sites/<name>`; `vercel.json` runs `cd ../.. && npm ci`. Restoring a site lockfile reintroduces the three-lockfile bug.

## Do not `vercel --prod` from a site subdirectory

Deploy is **git push to `main`**. A local `vercel --prod` from `sites/just-asking-questions` uses the wrong install root and can ship a tree that never ran `npm ci` at the workspace root.

## `PUBLIC_SHOW_DRAFTS` is not a Production flag

Preview and local `dev` only. Production must not show drafts. RSS is always published-only. Setting the env on the Production Vercel project is a content leak.

## `justaskingquestion.com` is a typo, not a site

It is aliased on the JAQ Vercel project and 308s to `www.just-asking-questions.com`. Do not create a third Vercel project for it. Do not “fix” the hostname by changing `siteUrl`.

## TAS Substack is empty

`npm run import:substack -- --site tas` succeeding with zero posts is correct. Do not invent TAS essays from JAQ imports. Paid Substack posts import the free teaser only; the 9/11 full text on JAQ is author/campaign material, not paid HTML.

## Decap OAuth host is JAQ for both admins

A GitHub OAuth App has one callback URL. Both `public/admin/config.yml` files use `base_url: https://www.just-asking-questions.com`. Pointing TAS at its own `/api/callback` without moving the OAuth App breaks TAS login. Local CMS uses `local_backend` + `decap-server` on 8081 only when the admin UI is on localhost.

## Samples are not published essays

`sites/<publication>/examples/` stays there. Copying `welcome.md` into `src/content/essays/` ships a sample.

## Heroes over 1.5 MB fail `npm run check`

Import auto-optimizes downloads. Hand-dropped PNG covers do not. Run `npm run optimize:images -- --site jaq` (or `tas`) before arguing with CI.

## Claim on your branch is invisible

`docs/LIVE_CLAIMS.md` is generated from `docs/claims/` on `main`. Opening a work PR with a claim that never landed is how two agents take the same files. P2: write-surface check applies to `agent/*` only.

## ASSIGNMENT empty is not a blank check

Roadmap “Next” rows are not a menu. The standing maintenance Task IDs are `process/claim-archive`, `process/live-claims-fresh`, and `process/bot-pr-babysit`. Wiki work is owner-directed, not a ROADMAP self-select.

## Redirect files are not a second CLAUDE.md

Do not paste operating rules into `AGENTS.md`, `GEMINI.md`, `.cursorrules`, or `.github/copilot-instructions.md`. They redirect here so they cannot drift.

## Do not export `ANTHROPIC_API_KEY` for Copilot BYOK

That console key is credit-dead. Fleet order is Grok → Codex → Kimi → Gemini, then native Copilot. `FLEET_INFERENCE.md` is the GitHub-runner contract.

## Hosted CI only

Never `runs-on: self-hosted`. Do not register the iMac or MacBook. Do not restart `~/actions-runners/*`.

## CMS commits to `main` on purpose

Decap `backend.branch: main` is a 2026-08-11 decision for solo authoring. Do not “fix” it onto a `cms/*` branch unless ASSIGNMENT says to. Prefixed messages: `content(jaq|tas): …`.

## Zod 4 is the root test helper only

Astro content collections still use `astro/zod`. “Upgrade Astro to Zod 4” is not a drive-by.

## `dist/` in a checkout is local build output

Both sites may have a `dist/` from a previous `npm run build`. Do not commit it. Do not treat it as source.
