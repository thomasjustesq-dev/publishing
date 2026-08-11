# Content CMS (Decap)

Git-backed editing for essay markdown. No separate CMS database.

## Local editing (works now)

```sh
# terminal 1 — proxy that writes to the working tree
npm run cms

# terminal 2 — Astro site
npm run dev:jaq   # or dev:tas

# open
# JAQ: http://localhost:4321/admin/
# TAS: http://localhost:4322/admin/
```

`local_backend: true` in each site’s `public/admin/config.yml` talks to
`decap-server` on port 8081 **only when the admin UI is on localhost**. Saves land
as files under `sites/*/src/content/essays/`. Commit and push as usual.

## Production GitHub OAuth

Each site ships serverless handlers:

| Path | Role |
| --- | --- |
| `/api/auth` | Redirect to GitHub authorize |
| `/api/callback` | Exchange code → access token; `postMessage` to Decap |

GitHub OAuth Apps allow **one** Authorization callback URL. Both CMS configs
therefore use **JAQ as the OAuth host**:

```yaml
backend:
  name: github
  repo: thomasjustesq-dev/publishing
  branch: main
  base_url: https://www.just-asking-questions.com
  auth_endpoint: api/auth
```

TAS admin at `https://www.theadversarialsystem.com/admin/` still works — the login
popup hits JAQ’s `/api/*`, and the callback allows both origins.

### Status (2026-08-11)

**Live.** OAuth App + JAQ Vercel `OAUTH_GITHUB_*` secrets are set. Production
admin: https://www.just-asking-questions.com/admin/ and
https://www.theadversarialsystem.com/admin/ (both auth via JAQ `/api/*`).
Commits land on `main` with `content(jaq|tas): …` messages.

### Operator setup (already done — reference)

1. GitHub OAuth App **Publishing Decap CMS** — callback  
   `https://www.just-asking-questions.com/api/callback`
2. JAQ Vercel env: `OAUTH_GITHUB_CLIENT_ID`, `OAUTH_GITHUB_CLIENT_SECRET`,
   `OAUTH_ORIGINS`, optional `OAUTH_REDIRECT_URL` — use `npm run oauth:env`
3. Redeploy JAQ after secret changes

Repo access: GitHub user must have write access to `thomasjustesq-dev/publishing`.
Scopes: `repo,user`.

### Optional: host OAuth on TAS instead

Mirror the same env vars on the adversarial-system Vercel project, set the OAuth
App callback to `https://www.theadversarialsystem.com/api/callback`, and point both
`config.yml` `base_url` values at that host.

## Media

Uploads go to `public/essays/_uploads/`. Prefer optimized covers under
`public/essays/<slug>/cover.webp` via `npm run optimize:images`.
