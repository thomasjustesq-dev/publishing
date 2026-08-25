#!/usr/bin/env bash
# Publish docs/wiki/ to the GitHub Wiki remote.
# GitHub does not create <repo>.wiki.git until a logged-in user clicks
# "Create the first page" on the Wiki tab once. After that, this script
# is the update path. Do not put secrets in wiki pages.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/docs/wiki"
REMOTE="${PUBLISHING_WIKI_REMOTE:-https://github.com/thomasjustesq-dev/publishing.wiki.git}"
WORK="$(mktemp -d "${TMPDIR:-/tmp}/publishing-wiki.XXXXXX")"
cleanup() { rm -rf "$WORK"; }
trap cleanup EXIT

if [[ ! -d "$SRC" ]]; then
  echo "missing $SRC" >&2
  exit 1
fi

python3 - "$SRC" "$WORK" <<'PY'
import re, sys
from pathlib import Path
src, dst = Path(sys.argv[1]), Path(sys.argv[2])
pages = {p.stem for p in src.glob("*.md")}
pat = re.compile(r"\[([^\]]+)\]\(([^)]+)\)")

def repl(m):
    text, href = m.group(1), m.group(2)
    if href.startswith(("http", "#", "/")):
        return m.group(0)
    stem = href[:-3] if href.endswith(".md") else href
    if stem in pages:
        return f"[{text}]({stem})"
    return m.group(0)

for p in src.glob("*.md"):
    if p.name == "README.md":
        continue
    (dst / p.name).write_text(pat.sub(repl, p.read_text()), encoding="utf-8")
PY

cd "$WORK"
git init -q -b master
git add .
git commit -q -m "Publish publishing internal wiki from docs/wiki/"
git remote add origin "$REMOTE"
if git push -f origin master; then
  echo "Published to $REMOTE"
  echo "https://github.com/thomasjustesq-dev/publishing/wiki"
  exit 0
fi

cat >&2 <<'EOF'
GitHub has not created publishing.wiki.git yet. That remote appears only after a
logged-in user opens https://github.com/thomasjustesq-dev/publishing/wiki and
clicks "Create the first page" once (content can be empty; this script
overwrites it). Then rerun:

  scripts/publish_wiki.sh
EOF
exit 2
