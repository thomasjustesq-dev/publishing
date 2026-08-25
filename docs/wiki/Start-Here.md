# Start here

Fifteen minutes, then stop and do the assigned task. Do not wander `design/archives/` or invent a third site.

## 1. Confirm the machine

The Crucial X8 must be mounted at `/Volumes/Crucial X8`. If it is not, stop. Canonical checkout is `/Volumes/Crucial X8/GitHub/publishing` — not `GitHub/Projects/publishing` (that path is a stale TODO.md leftover). Analyse and implement from a worktree on `origin/main` unless the briefing says otherwise. Protocol: vault note `Projects/Claude Code/_Coordination.md`, then `Projects/Claude Code/publishing.md`, then this repo's `CLAUDE.md`.

Register on `Projects/Claude Code/_Live.md` before writing. Surface is `checkout :: glob` and must include the worktree path if you are not on the canonical tree. Two agents may share this repo only on disjoint globs.

Claim-first is wired. A claim only on your topic branch is invisible. `scripts/claim-open.sh` lands the claim on `main` before product work. This handbook was an owner-directed docs-process land; do not steal an Active claim if `docs/LIVE_CLAIMS.md` later shows one on `docs/wiki/**`, `README.md`, `CLAUDE.md`, or `scripts/publish_wiki.sh`.

## 2. Read these, in this order

1. This page and [Current status](Current-Status.md).
2. [Operating rules](Operating-Rules.md) (`CLAUDE.md` + `docs/WORKBOARD.md`).
3. [Traps](Traps.md).
4. [Architecture](Architecture.md) if the task touches packages, sites, or Vercel.
5. The README publishing loop if the task is an essay.

Do not read `docs/ROADMAP.md` as a build menu. Implement only work on your `docs/ASSIGNMENT.md` row. Empty slot: babysit your own PRs, merge green claims-only bot PRs, take a standing maintenance Task ID, or ask Thomas.

## 3. Hard facts that change what you build

- **Astro-first.** Live UI is each site's Astro layouts and pages. React design-system packages under `design/archives/` are reference only. Do not add them back to workspaces or CI.
- **Brand truth** is `sites/<publication>/brand/tokens.json` plus `src/styles/tokens.css`. Fonts are self-hosted.
- **Single lockfile.** Install only from the monorepo root. Site `package-lock.json` files are gone on purpose.
- **Essay ideas start in the vault** (`Writing/Idea Hopper.md`). This repo is the ship surface.
- **`justaskingquestion.com` is a typo.** It 308s to `www.just-asking-questions.com`. It is not a third site.
- **Drafts never ship to Production.** `PUBLIC_SHOW_DRAFTS=1` is Preview (and local `dev`) only. RSS is published-only.
- **Do not `vercel --prod` from a site subdirectory.** Deploy is git push to `main`; Vercel Root Directory is `sites/<name>`.
- **TAS Substack is empty.** Do not treat a no-op import as a bug.
- **Hosted CI only.** Never `runs-on: self-hosted`.

## 4. How to run

Node.js **22.12+** (`.nvmrc` is `22`).

```bash
npm install
npm run check
npm run build
npm run dev:jaq        # localhost:4321
npm run dev:tas        # localhost:4322
```

`npm run check` is content + tokens + images + unit tests. `REQUIRE_PUBLISHED_ESSAYS=1 npm run check` fails if a site has zero live essays. `npm run publish:check` is the full gate before push.

Scaffold, don't hand-roll a new markdown file:

```bash
npm run new-essay -- --site jaq --slug my-essay --title "My Essay"
```

Local CMS: `npm run cms` plus `dev:jaq` or `dev:tas`, then `/admin/`. Production admin auths through JAQ's `/api/auth` for both sites. See `docs/CMS.md`.

## 5. Then do the work

Stay inside the declared write surface. Never push directly to `main`. Prefer a small, reviewable PR. Fleet inference: Grok → Codex → Kimi → Gemini, then native Copilot. See `FLEET_INFERENCE.md`. Do not export `ANTHROPIC_API_KEY` for Copilot BYOK.
