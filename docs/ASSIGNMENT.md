# Daily assignment card

**Authority:** this file is the only self-serve menu. `ROADMAP.md` sequences
product; this file answers *who works today*.

If every continuous slot is **empty**, agents may only:

1. Babysit **their own** open PRs.
2. Merge green **claims-only** bot PRs.
3. Take a Task ID from the **standing maintenance menu**.
4. Ask Thomas.

**Do not self-select** from ROADMAP when this card is empty.

## Current assignments

**Card date:** 2026-08-26

Pinned to `origin/main` `80641eb` (PR #40). LIVE_CLAIMS is empty.
Closeout (#30) and wiki (#40) are on `main`. Next is content, not product.

| Slot | Owner | Task ID | Claim on main? | Work PR | Notes |
| --- | --- | --- | --- | --- | --- |
| Continuous — Grok | | | | | done 2026-08-11: `product/publishing-closeout` (#30). wiki #40 merged 2026-08-25. Do not revive `design/archives/`. |
| Continuous — Codex | | | | | |
| Continuous — Kimi | | | | | |
| On-demand — Claude | | | | | |
| Human — Thomas | | | n/a | n/a | Write and ship essays (vault Idea Hopper first). Wiki tab first page then `scripts/publish_wiki.sh`. Not agent-matched |

## Standing maintenance menu

| Task ID | Allowed write surface | Notes |
| --- | --- | --- |
| `process/claim-archive` | `docs/claims/` | Archive closed claims |
| `process/live-claims-fresh` | `docs/LIVE_CLAIMS.md` | Regenerate index |
| `process/bot-pr-babysit` | none | Merge green claims-only PRs |

## Related

- [`LIVE_CLAIMS.md`](LIVE_CLAIMS.md)
- [`WORKBOARD.md`](WORKBOARD.md)
