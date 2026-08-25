# Publishing internal wiki

In-repo copy of the internal handbook. After the GitHub Wiki tab has been clicked once (“Create the first page”), `scripts/publish_wiki.sh` publishes these pages to [the Wiki](https://github.com/thomasjustesq-dev/publishing/wiki). GitHub will 404 that URL until that first click; this directory is the living copy either way.

Start at [Home](Home.md). Agents: [Start here](Start-Here.md).

| Page | Purpose |
| --- | --- |
| [Home](Home.md) | What this repo is, document authority, how to navigate |
| [Start here](Start-Here.md) | First fifteen minutes for an agent |
| [Current status](Current-Status.md) | Operating posture as of the pinned SHA |
| [Architecture](Architecture.md) | Two Astro sites, shared packages, Vercel |
| [Operating rules](Operating-Rules.md) | CLAUDE.md, claim-first, ship loop |
| [Traps](Traps.md) | Known ways to ship the wrong thing |
| [Contributing](Contributing.md) | PR, wiki hygiene, coordination |

Canonical living documents remain `README.md`, `CLAUDE.md`, and `docs/`. Snapshot: `origin/main` `ad36232` (2026-08-19).
