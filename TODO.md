# Todo / handoff

**Updated:** 2026-08-10 (closeout)  
**Repo:** `/Volumes/Crucial X8/GitHub/Projects/publishing`  
**Branch:** `main`

## Do next (you — ~2 minutes)

1. **Finish GitHub OAuth App** (browser should be open at applications/new)  
   - Homepage: `https://www.just-asking-questions.com`  
   - Callback: `https://www.just-asking-questions.com/api/callback`  
   - Then:
     ```sh
     export OAUTH_GITHUB_CLIENT_ID=...
     export OAUTH_GITHUB_CLIENT_SECRET=...
     node scripts/set-oauth-env.mjs
     # redeploy JAQ when Vercel rate limit clears (~24h from earlier bursts)
     ```
   - Smoke: `https://www.just-asking-questions.com/admin/`

2. **Optional: replace 9/11 body with Substack author export**  
   Site now has a full free essay reconstructed from the campaign 9/11 post + Substack teaser (not the paid Substack HTML). If you want byte-identical Substack prose, paste from author dashboard and keep `paywalled: false`.

## Already done

- Two-site monorepo, Decap local + production OAuth *code* (#25)  
- Dependabot checkout v7 + claude-code-action bumps merged  
- 9/11 essay: full free body on site (`format: essay`, `paywalled: false`)  
- TAS Substack import: **no posts** on feed (nothing to import)  
- Vercel env: `PUBLIC_SITE_URL`, `PUBLIC_SHOW_DRAFTS` (Preview), `SUBSTACK_FEED_URL` present  
- `scripts/set-oauth-env.mjs` for one-shot secret push  

## Live

| Site | URL |
| --- | --- |
| JAQ | https://www.just-asking-questions.com |
| TAS | https://www.theadversarialsystem.com |
