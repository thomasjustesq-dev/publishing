# Decisions

Append-only. `merge=union`.

---

## 2026-08-04 — Adopt scaled multi-agent coordination

**Decision:** Install PENUMBRA/OVERLAND-scaled claim-first package
(ASSIGNMENT, claims, write surfaces, union logs, path classifier, guard).

**Rationale:** Fleet-wide consistency across repositories; prevent collision
classes once multi-agent work is real.

**Scope:** process/docs/scripts only for this land. Product behavior unchanged.

---

## 2026-08-10 — Astro-first monorepo finish

**Decision:** Live presentation is Astro-only. React design-sync packages moved to
`design/archives/` and removed from workspaces/CI. Shared product code lives in
`@pub/core` and `@pub/site-kit`. Single root lockfile; Vercel installs from monorepo
root with site Root Directory. Fonts self-hosted via `@fontsource`.

**Rationale:** Sites never imported the React packages; dual UI sources drifted.
Three lockfiles and dual install models fought each other. Google Fonts complicated CSP.

**Scope:** product packages, both sites, CI, README/TODO. DNS/Vercel dashboard env
and first real essays remain operator steps.

---

## 2026-08-10 — Full upgrade wave (images, schema, drafts, SEO)

**Decision:** Ship image optimization (sharp/WebP), extended essay schema
(format/media/paywall/import), Astro essay components, draft preview via
`PUBLIC_SHOW_DRAFTS`, tags routes, WebSite/Person JSON-LD, www canonicals,
and publish tooling. React DS remains archived.

**Rationale:** Complete the monorepo product surface without CMS or React dual stack.


---

## 2026-08-10 — Second upgrade wave (product + deferred items)

**Decision:** Ship reading UX (time, progress, related, print), Pagefind search,
author pages, cache headers, Substack frame embeds, Decap CMS admin shell,
@pub/site-ui re-exports, Zod 4 for root tests, weekly substack-drift workflow,
ship script. Full CMS backend auth still requires OAuth config. Paywalled 9/11
full text remains teaser until Thomas supplies body.

---

## 2026-08-10 — Decap production OAuth host is JAQ

**Decision:** Self-host GitHub OAuth for Decap as Vercel serverless
`/api/auth` + `/api/callback` (zero npm OAuth deps). Both JAQ and TAS admin
configs use `base_url: https://www.just-asking-questions.com` because a GitHub
OAuth App has one callback URL. Token `postMessage` origins allow both www
domains. Local CMS still uses `local_backend` + `decap-server`.

**Rationale:** Netlify’s free OAuth proxy is not available for pure Vercel
deploys; one OAuth App keeps operator setup simple for a two-site monorepo.

---

## 2026-08-10 — 9/11 essay free full text on JAQ

**Decision:** Replace the Substack teaser stub with a full free essay on the
designed site (`format: essay`, `paywalled: false`). Body uses the Substack
opening paragraph plus narrative drawn from the campaign 9/11 post materials
(not a dump of the paid Substack HTML, which the public API does not return).

**Rationale:** Canonical site should not force a paywall for this piece;
Substack remains the distribution link via `substackUrl`. Author may later
swap in verbatim Substack prose if desired.

---

## 2026-08-11 — CMS commits to main; CI publish:check

**Decision:** Keep Decap `backend.branch: main` for solo authoring with
prefixed commit messages. Add `publish:check` to CI after build so zero-live-essay
or broken pagefind fails the suite.

**Rationale:** Editorial-branch workflow adds friction without a second editor;
ship-check belongs in required CI.
