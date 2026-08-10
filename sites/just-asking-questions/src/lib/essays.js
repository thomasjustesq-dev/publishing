import { essayFilter as kitFilter, publishedOnly, isDraftVisible } from '@pub/site-kit';

export function essayFilter(entry) {
  return kitFilter(entry, import.meta.env);
}

export { publishedOnly, isDraftVisible };

export function showDrafts() {
  return isDraftVisible(import.meta.env);
}
