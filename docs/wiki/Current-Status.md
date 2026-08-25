# Current status

Snapshot of `origin/main` at `ad36232` (2026-08-19, “Expect grok-4.6 as xAI preflight default model”). Living status also lives in `README.md`, `docs/ROADMAP.md`, and `TODO.md`. This page is orientation, not a scorecard.

## Operating posture

| Item | State |
| --- | --- |
| Product (Astro-first monorepo) | **Done** (2026-08-10). Shared `@pub/core` + `@pub/site-kit`; React DS archived |
| Vercel domains + env | **Done.** Both projects; typo domain 308s to JAQ www |
| Decap production OAuth | **Done.** JAQ host for both admin UIs |
| First published essays | **Seed.** JAQ: 6; TAS: charter *Opening the docket* |
| Fleet inference canary | **Done.** Grok → Codex → Kimi → Gemini, then native Copilot |
| `docs/ASSIGNMENT.md` | **Empty.** No self-serve product Task ID |
| Next product work | Thomas assigns a Task ID. Do not self-select ROADMAP |
| Ongoing content | Operator writing and shipping essays |

## Live surfaces

| Publication | Website | Substack | Dev |
| --- | --- | --- | --- |
| Just Asking Questions | https://www.just-asking-questions.com | https://thomasjustaskingquestions.substack.com | `:4321` |
| The Adversarial System | https://www.theadversarialsystem.com | https://theadversarialsystem.substack.com | `:4322` |
| JAQ admin | https://www.just-asking-questions.com/admin/ | — | local `/admin/` via `npm run cms` |
| TAS admin | https://www.theadversarialsystem.com/admin/ | — | same OAuth host (JAQ `/api/*`) |

`justaskingquestion.com` (no “s”) is on the JAQ Vercel project and 308s to `www.just-asking-questions.com`.

## Seed essays on this SHA

JAQ (`sites/just-asking-questions/src/content/essays/`):

| Slug | Title | Date |
| --- | --- | --- |
| `is-masculinity-in-crisis` | Is Masculinity in Crisis? | 2025-01-22 |
| `the-stoicism-question` | The Stoicism Question | 2025-02-07 |
| `rule-of-law-breakdown` | Rule of Law Breakdown? | 2025-03-26 |
| `the-face-of-texas-grassroots` | The Face of Texas Grassroots | 2025-08-28 |
| `from-911-to-the-bench-a-journey-of` | From 9/11 to the Bench: A Journey of Service | 2025-09-11 |
| `flipping-a-judgeship-in-hays-county` | Flipping a judgeship in Hays County, TX | 2025-10-08 |

TAS: `opening-the-docket` — *Opening the docket* (2026-08-10). TAS Substack feed is still empty; import is a no-op until posts exist.

The 9/11 piece is free full text on the designed site (`paywalled: false`), not a Substack teaser stub. Body is campaign materials plus the public Substack opening, not paid Substack HTML.

## What continues

Write and ship essays. Scaffold with `npm run new-essay`. After a Substack post is live, `npm run set-substack-url`. Drift: `npm run substack:drift -- --site jaq`. Optional: replace the 9/11 body with a verbatim author export; smoke Decap login once.

## Open questions (not a build menu)

| Item | State |
| --- | --- |
| Next product Task ID | Open. Thomas fills ASSIGNMENT when he wants agent writing or infra work |
| Decap commits on `cms/*` + PR vs `main` | Open. Solo-author default remains `backend.branch: main` |

See `docs/OPEN_QUESTIONS.md`.

## What is not the current job

Do not revive `design/archives/`. Do not add a third publication. Do not treat vault folders `Projects/Just Asking Questions/` or `Projects/The Adversarial System/` as the git tree. Do not `vercel --prod` from `sites/<name>`. Do not set `PUBLIC_SHOW_DRAFTS` on Production. Do not self-select ROADMAP while ASSIGNMENT is empty.
