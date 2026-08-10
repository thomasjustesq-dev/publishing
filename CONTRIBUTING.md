# Contributing

## Setup

```sh
npm install          # monorepo root only — no site-level locks
npm run check
npm run build
```

## Workflow

1. Create a branch from `main` (or claim-first per `docs/WORKBOARD.md` if multi-agent).
2. Make the smallest change that solves the problem.
3. Run `npm run check` and `npm run build` before opening a PR.
4. Essays: `sites/<publication>/src/content/essays/`. Samples: `sites/<publication>/examples/`.
5. Scaffold: `npm run new-essay -- --site jaq|tas --slug kebab --title "Title"`.
6. After Substack publish, set `substackUrl` on the essay and re-run checks.
7. If you change CSP/headers in `@pub/site-kit`, run `npm run sync:vercel` and commit both sites’ `vercel.json`.

## Pull requests

- Explain what changed and why.
- Include verification output for `npm run check` and `npm run build`.
- Do not commit `dist/`, `node_modules/`, `.env*`, `*.substack.html`, or `.DS_Store`.
