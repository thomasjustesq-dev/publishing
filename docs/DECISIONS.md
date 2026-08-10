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
