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
`decap-server` on port 8081. Saves land as files under `sites/*/src/content/essays/`.
Commit and push as usual.

## Production GitHub OAuth

The GitHub backend needs an OAuth app + auth proxy. Options:

1. **Netlify Identity / Decap proxy** (default `base_url: https://api.netlify.com`)
2. **Self-hosted** [decap-cms-oauth](https://github.com/vencax/netlify-cms-github-oauth-provider) or similar on Vercel

Steps for a GitHub OAuth App:

1. GitHub → Settings → Developer settings → OAuth Apps → New  
2. Homepage: `https://www.just-asking-questions.com`  
3. Callback: proxy callback URL (provider-specific)  
4. Set client id/secret on the proxy  
5. Point `backend.base_url` / `auth_endpoint` in `config.yml` at the proxy  

Until OAuth is live, use **local CMS** + PR/push for production content.

## Media

Uploads go to `public/essays/_uploads/`. Prefer optimized covers under
`public/essays/<slug>/cover.webp` via `npm run optimize:images`.
