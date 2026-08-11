# Open questions

Append-only. `merge=union`.

---

## 2026-08-04

1. **[RESOLVED 2026-08-11]** Repository secret `REPO_PAT` is configured (claim-reconcile hard-require).
2. **[OPEN]** What is the next product Task ID for ASSIGNMENT? (Content-driven — Thomas fills when he wants agent writing/infra work.)

## 2026-08-10

1. **[RESOLVED]** Vercel Production env vars (`PUBLIC_SITE_URL`, `SUBSTACK_FEED_URL`) present on both projects; `PUBLIC_SHOW_DRAFTS` on Preview.
2. **[RESOLVED 2026-08-10]** `justaskingquestion.com` and `www.justaskingquestion.com` 308 → `www.just-asking-questions.com` on Vercel.
3. **[RESOLVED 2026-08-10]** GitHub OAuth App + `OAUTH_GITHUB_*` Vercel secrets live; `/api/auth` returns 302 to GitHub authorize.

## 2026-08-11

1. **[OPEN]** Prefer Decap commits on a `cms/*` branch + PR instead of direct `main`? (Solo author default remains `main`.)
