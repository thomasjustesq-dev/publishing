# Contributing

## Setup

```sh
npm install
npm run check
npm run build
```

## Workflow

1. Create a branch from `main`.
2. Make the smallest change that solves the problem.
3. Run `npm run check` and `npm run build` before opening a PR.
4. Keep essays in `sites/<publication>/src/content/essays/`; keep samples in
   `sites/<publication>/examples/`.
5. After publishing an essay to Substack, add its `substackUrl` to the essay
   frontmatter and re-run the checks.

## Pull requests

- Explain what changed and why.
- Include verification output for `npm run check` and `npm run build`.
- Do not commit generated `dist/`, `node_modules/`, `.env`, or `*.substack.html` files.
