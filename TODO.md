# Todo / handoff

**Updated:** 2026-08-10 (Grok — Decap OAuth code)  
**Repo:** `/Volumes/Crucial X8/GitHub/Projects/publishing`  
**Branch:** `agent/grok/task-github-oauth` (work PR when ready)

## Do next (you)

1. **GitHub OAuth App + Vercel secrets** (unblocks production `/admin/` login)  
   See **`docs/CMS.md`**. Create OAuth App with callback  
   `https://www.just-asking-questions.com/api/callback`. Set on JAQ Vercel project:  
   `OAUTH_GITHUB_CLIENT_ID`, `OAUTH_GITHUB_CLIENT_SECRET`,  
   `OAUTH_ORIGINS=https://www.just-asking-questions.com,https://www.theadversarialsystem.com`  
   Redeploy JAQ; smoke `https://www.just-asking-questions.com/admin/` and TAS admin.

2. **9/11 essay full text** — `sites/just-asking-questions/src/content/essays/from-911-to-the-bench-a-journey-of.md`  
   Still a **paywalled teaser** (Substack API only returns the free preview). Paste the full body when you have it, set `format: "essay"`, `paywalled: false`, then `npm run publish:check`.

3. **TAS Substack** — site has charter filing *Opening the docket*. When Substack has posts:  
   `npm run import:substack -- --site tas`

## Already done (don’t redo)

- Two-site monorepo (JAQ + TAS), Astro-first, `@pub/core` + `@pub/site-kit`  
- JAQ: 6 essays from Substack, image WebP pipeline, tags, search (Pagefind), author, reading UX  
- TAS: charter essay, empty-state mission copy  
- Draft preview env, ship/drift scripts, Decap **local** admin, CSP/cache headers  
- Decap **production OAuth handlers** (code) — secrets still operator  
- Vercel env confirmed present: both projects have `PUBLIC_SITE_URL` (Production + Preview),  
  `PUBLIC_SHOW_DRAFTS` (Preview), `SUBSTACK_FEED_URL` (Production + Preview + Dev)  
- Docs: `README.md`, `docs/CMS.md`, `docs/DECISIONS.md`

## Quick commands

```sh
cd "/Volumes/Crucial X8/GitHub/Projects/publishing"
git pull
npm install
npm run check
npm run dev:jaq    # :4321
# npm run cms      # Decap local backend :8081 → open /admin/
```

## Live

| Site | URL |
| --- | --- |
| JAQ | https://www.just-asking-questions.com |
| TAS | https://www.theadversarialsystem.com |
