# Claim — github-oauth

- Task Type: Maintenance
- Task ID: cms/github-oauth
- Branch: agent/grok/task-github-oauth
- Base Branch: main
- Tool: Grok
- Assigned By: Thomas
- Date Claimed: 2026-08-10
- Last Updated: 2026-08-10
- Date Closed: 2026-08-10
- Status: Merged
- Blocked By: none
- Pull Request: https://github.com/thomasjustesq-dev/publishing/pull/25

## Scope

- Production Decap GitHub OAuth proxy on Vercel for JAQ and TAS admin
- Does not create the GitHub OAuth App or set Vercel secrets (operator)
- Does not paste 9/11 full essay text

## Write surface

- `sites/just-asking-questions/api/`
- `sites/adversarial-system/api/`
- `sites/just-asking-questions/public/admin/`
- `sites/adversarial-system/public/admin/`
- `sites/just-asking-questions/vercel.json`
- `sites/adversarial-system/vercel.json`
- `docs/CMS.md`
- `docs/SESSION_LOG.md`
- `docs/DECISIONS.md`
- `TODO.md`
- `packages/site-kit/src/vercel.mjs`

## Hot spots

- Admin CSP / Vercel headers (shared site-kit generator)
- CMS config base_url (both sites → JAQ OAuth host)

## Handoff

- Closed: OAuth code merged (#25). Secrets still operator (`scripts/set-oauth-env.mjs`).
- Touched files: api/auth + api/callback both sites; admin config/index; CMS.md; site-kit CSP; vercel.json sync
- Tests run: `npm run check`
- Remaining: create GitHub OAuth App + Vercel env; smoke `/admin/`
