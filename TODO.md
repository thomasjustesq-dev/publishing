# Todo / handoff

**Updated:** 2026-08-11 (Grok closeout)  
**Repo:** `/Volumes/Crucial X8/GitHub/Projects/publishing`  
**Branch:** `main`

## Operator (optional only)

1. **Smoke Decap once** — https://www.just-asking-questions.com/admin/ → Login with GitHub.  
   OAuth App + Vercel secrets are already live (`/api/auth` → GitHub 302).

2. **Substack-accurate 9/11 body (optional)** — free full essay is live from campaign materials + Substack teaser. Replace with author export if you want Substack prose verbatim.

3. **TAS Substack** — feed still empty. When posts exist:  
   `npm run import:substack -- --site tas`

4. **Write / publish essays** — product is content. Scaffold with:  
   `npm run new-essay -- --site jaq|tas --slug … --title "…"`

## Already done

- Two-site monorepo (JAQ + TAS), Astro, SEO, search, drafts, images  
- Decap local + production OAuth (code + secrets + deploy)  
- Domains on Vercel (www + apex + typo `justaskingquestion.com` → JAQ www)  
- Vercel env: `PUBLIC_SITE_URL`, `PUBLIC_SHOW_DRAFTS` (Preview), `SUBSTACK_FEED_URL`, OAuth  
- REPO_PAT set (claim-reconcile)  
- 9/11 essay free full body; TAS charter *Opening the docket*  
- Fleet inference canary + multi-provider preflights  
- Docs/OPEN_QUESTIONS/ROADMAP refreshed in product/publishing-closeout  

## Live

| Site | URL |
| --- | --- |
| JAQ | https://www.just-asking-questions.com |
| TAS | https://www.theadversarialsystem.com |
| JAQ admin | https://www.just-asking-questions.com/admin/ |
| TAS admin | https://www.theadversarialsystem.com/admin/ |
