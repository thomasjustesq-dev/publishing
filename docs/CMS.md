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

### Operator setup (one-time)

1. **GitHub → Settings → Developer settings → OAuth Apps → New OAuth App**
   - Application name: `Publishing Decap CMS`
   - Homepage URL: `https://www.just-asking-questions.com`
   - Authorization callback URL: `https://www.just-asking-questions.com/api/callback`
2. **Vercel → just-asking-questions → Settings → Environment Variables** (Production + Preview):

   | Name | Value |
   | --- | --- |
   | `OAUTH_GITHUB_CLIENT_ID` | OAuth App client id |
   | `OAUTH_GITHUB_CLIENT_SECRET` | OAuth App client secret |
   | `OAUTH_ORIGINS` | `https://www.just-asking-questions.com,https://www.theadversarialsystem.com` |
   | `OAUTH_REDIRECT_URL` | `https://www.just-asking-questions.com/api/callback` (optional; default matches host) |

3. Redeploy JAQ (env vars apply on next deploy).
4. Open `https://www.just-asking-questions.com/admin/` → Login with GitHub.
5. Same login from `https://www.theadversarialsystem.com/admin/` (popup uses JAQ host).

Repo access: the GitHub user must have write access to `thomasjustesq-dev/publishing`.
Scopes requested: `repo,user`.

### Optional: host OAuth on TAS instead

Mirror the same env vars on the adversarial-system Vercel project, set the OAuth
App callback to `https://www.theadversarialsystem.com/api/callback`, and point both
`config.yml` `base_url` values at that host.

## Media

Uploads go to `public/essays/_uploads/`. Prefer optimized covers under
`public/essays/<slug>/cover.webp` via `npm run optimize:images`.
