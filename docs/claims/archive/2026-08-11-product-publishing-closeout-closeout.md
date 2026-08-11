# Claim — closeout

- Task Type: Maintenance
- Task ID: product/publishing-closeout
- Branch: agent/grok/task-closeout
- Base Branch: main
- Tool: Grok
- Assigned By: Thomas
- Date Claimed: 2026-08-11
- Last Updated: 2026-08-11
- Date Closed: 2026-08-11
- Status: Merged
- Blocked By: none
- Pull Request: https://github.com/thomasjustesq-dev/publishing/pull/30

## Scope

- Docs/TODO/OPEN_QUESTIONS/ROADMAP refresh (OAuth, domains, REPO_PAT resolved)
- Decap CMS polish (commit messages, preview paths, field hints)
- Admin `X-Robots-Tag: noindex`; CI `publish:check`
- Does **not** invent new essays or Substack posts for Thomas

## Write surface

- `docs/`
- `TODO.md`
- `README.md`
- `sites/just-asking-questions/`
- `sites/adversarial-system/`
- `scripts/`
- `packages/site-kit/`
- `.github/`
- `package.json`

## Hot spots

- `docs/OPEN_QUESTIONS.md`, `TODO.md` (handoff)
- Decap `public/admin/config.yml` both sites
- `packages/site-kit/src/vercel.mjs` → regenerated `vercel.json`

## Handoff

- Smoke: `/api/auth` 302, admin 200, publish:check pass, REPO_PAT secret present
- Remaining: Thomas writes essays; optional Substack 9/11 paste; TAS Substack when feed has posts
