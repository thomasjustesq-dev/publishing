/**
 * Pick related essays by explicit related slugs, then shared tags.
 */
export function pickRelated(current, all, limit = 3) {
  const id = current.id;
  const explicit = new Set(current.data.related || []);
  const tags = new Set(current.data.tags || []);
  const scored = [];

  for (const other of all) {
    if (other.id === id || other.data.draft) continue;
    let score = 0;
    if (explicit.has(other.id)) score += 100;
    for (const t of other.data.tags || []) {
      if (tags.has(t)) score += 10;
    }
    if (score > 0) scored.push({ essay: other, score });
  }

  scored.sort((a, b) => b.score - a.score || b.essay.data.date - a.essay.data.date);
  return scored.slice(0, limit).map((s) => s.essay);
}
