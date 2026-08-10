/**
 * Draft visibility for Astro content collections.
 * Production never shows drafts. Dev always does. Preview when PUBLIC_SHOW_DRAFTS=1.
 */
export function isDraftVisible(env = typeof import.meta !== 'undefined' ? import.meta.env : {}) {
  if (env?.PROD && env?.PUBLIC_SHOW_DRAFTS !== '1') return false;
  if (env?.DEV) return true;
  return env?.PUBLIC_SHOW_DRAFTS === '1';
}

/**
 * Filter for getCollection('essays', essayFilter).
 * @param {{ data: { draft?: boolean } }} entry
 * @param {Record<string, unknown>} [env]
 */
export function essayFilter(entry, env) {
  if (!entry?.data?.draft) return true;
  return isDraftVisible(env);
}

/** Always exclude drafts (RSS, production sitemaps of essays list). */
export function publishedOnly({ data }) {
  return !data.draft;
}
