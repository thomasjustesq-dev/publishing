# Operating rules

Short form of `CLAUDE.md` plus the briefing. Product truth lives in `README.md` and `docs/`. Sequencing is `docs/ROADMAP.md`; implement only work on your `docs/ASSIGNMENT.md` row.

## The rules that bind

1. **Claim-first before product work.** Land the claim on `main` with `scripts/claim-open.sh` before implementation. A claim on a topic branch is invisible to every other agent. Collisions happen on files; declare a write surface.
2. **ASSIGNMENT is the only self-serve menu.** Empty slot means babysit your own PRs, merge green claims-only bot PRs, take a standing maintenance Task ID, or ask Thomas. Do not self-select ROADMAP.
3. **Never push directly to `main`.** Worktrees under `/Volumes/Crucial X8/GitHub/publishing-worktrees/`. Prefer small, reviewable PRs.
4. **Stay inside the declared write surface.** Whole-tree roots alone are forbidden as a sole surface. `scripts/check-write-surface.sh` enforces the lease on `agent/*` branches only — that is a known limit (P2), not permission to roam on `docs/*` branches.
5. **Astro-first.** Do not revive `design/archives/`. Do not add React DS packages back to workspaces or CI.
6. **Brand truth is tokens.** `brand/tokens.json` + `src/styles/tokens.css`. `npm run check` verifies token coverage. Chrome stays in each site so JAQ and TAS can diverge.
7. **Essay ideas start in the vault.** `Writing/Idea Hopper.md` first. This repo is the ship surface.
8. **Single lockfile.** `npm install` from the monorepo root only. Do not restore site-level `package-lock.json`.
9. **Drafts never Production.** `PUBLIC_SHOW_DRAFTS` is Preview and local `dev`. RSS is published-only.
10. **Deploy is git push.** Vercel Root Directory is `sites/<name>`; install is `cd ../.. && npm ci`. Do not `vercel --prod` from a site subdirectory.
11. **Samples are not content.** `sites/<publication>/examples/` stays out of `src/content/essays/`.
12. **Hosted CI only.** Never `runs-on: self-hosted`. Do not register the iMac or MacBook.
13. **Do not copy rules into the redirect files.** `AGENTS.md`, `GEMINI.md`, `.cursorrules`, `.github/copilot-instructions.md` point at `CLAUDE.md`. Duplicated rules drift.
14. **Fleet inference:** Grok → Codex → Kimi → Gemini, then native GitHub Copilot. Use repo secrets and `COPILOT_PROVIDER_*`. Do not call GitHub-hosted models while a BYOK key is healthy. Do not export `ANTHROPIC_API_KEY` for Copilot BYOK.
15. **If something is ambiguous,** append to `docs/OPEN_QUESTIONS.md` and implement the most conservative reading.

## Path classes (WORKBOARD)

| Class | Paths | Label | Merge |
| --- | --- | --- | --- |
| Registry | `docs/claims/**`, `LIVE_CLAIMS`, `ASSIGNMENT` | `claims-only` | squash auto-merge |
| Docs/process | `docs/**`, `.github/**`, `scripts/**`, `*.md` | `docs-process` | squash auto-merge |
| Product | everything else | none | rebase manual |

`docs/DECISIONS.md`, `SESSION_LOG.md`, and `OPEN_QUESTIONS.md` are append-only (`merge=union`).

## Publishing loop (short)

Scaffold → write markdown → `draft: false` + `description` → `npm run check` → Substack export → `set-substack-url` → `npm run publish:check`. Heroes: `npm run optimize:images`. Import: `npm run import:substack -- --site jaq|tas` (paid posts import the free teaser only; skip `coming-soon`).

## What not to do

Do not start essays in this repo. Do not treat Decap production OAuth as unfinished (it is live). Do not point TAS `base_url` at TAS unless you also move the GitHub OAuth App callback. Do not commit `dist/`, `node_modules/`, `.env*`, `*.substack.html`, or `.DS_Store`. Do not put secrets in wiki pages.
