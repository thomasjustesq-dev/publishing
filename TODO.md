# Todo / handoff

**Updated:** 2026-08-10 (before reboot)  
**Repo:** `/Volumes/Crucial X8/GitHub/Projects/publishing`  
**Branch:** `main` (push when drive is mounted)

## Do next (you)

1. **9/11 essay full text** — `sites/just-asking-questions/src/content/essays/from-911-to-the-bench-a-journey-of.md`  
   Still a **paywalled teaser** (Substack API only returns the free preview). Paste the full body when you have it, set `format: "essay"`, `paywalled: false`, then `npm run publish:check`.

2. **Production Decap OAuth** — local CMS works now; live `/admin/` needs GitHub OAuth.  
   See **`docs/CMS.md`**. Until then: `npm run cms` + `npm run dev:jaq` → `http://localhost:4321/admin/`.

3. **TAS Substack** — site has charter filing *Opening the docket*. When Substack has posts:  
   `npm run import:substack -- --site tas`

4. **Optional:** confirm Vercel Preview still has `PUBLIC_SHOW_DRAFTS=1` and www `PUBLIC_SITE_URL` on both projects.

## Already done (don’t redo)

- Two-site monorepo (JAQ + TAS), Astro-first, `@pub/core` + `@pub/site-kit`  
- JAQ: 6 essays from Substack, image WebP pipeline, tags, search (Pagefind), author, reading UX  
- TAS: charter essay, empty-state mission copy  
- Draft preview env, ship/drift scripts, Decap **local** admin, CSP/cache headers  
- Docs: `README.md`, `docs/CMS.md`, `docs/DECISIONS.md`

## Quick commands after reboot

```sh
# drive must be mounted
cd "/Volumes/Crucial X8/GitHub/Projects/publishing"
git pull
npm install
npm run check
npm run dev:jaq    # :4321
# npm run dev:tas  # :4322
# npm run cms      # Decap local backend :8081 → open /admin/
```

## Live

| Site | URL |
| --- | --- |
| JAQ | https://www.just-asking-questions.com |
| TAS | https://www.theadversarialsystem.com |
