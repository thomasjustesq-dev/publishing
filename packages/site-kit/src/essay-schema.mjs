/**
 * Shared essay frontmatter schema for Astro content collections.
 * Pass the Zod instance from `astro:content` / `astro/zod` so versions stay aligned.
 *
 * @param {typeof import('zod').z} z
 */
export function essayCollectionSchema(z) {
  return z.object({
    title: z.string().min(1),
    description: z.string().min(1).optional(),
    date: z.coerce.date().refine((value) => value.getTime() <= Date.now(), {
      message: 'essay date cannot be in the future',
    }),
    updated: z.coerce.date().optional(),
    hero: z.string().optional(),
    heroAlt: z.string().optional(),
    format: z.enum(['essay', 'podcast', 'video', 'teaser']).default('essay'),
    audioUrl: z.string().url().optional(),
    videoUrl: z.string().url().optional(),
    series: z.string().optional(),
    related: z.array(z.string()).default([]),
    imported: z.boolean().default(false),
    importSource: z.string().url().optional(),
    paywalled: z.boolean().default(false),
    canonical: z.string().url().optional(),
    substackUrl: z.string().url().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  });
}

/** Format labels for UI kickers */
export const FORMAT_LABELS = {
  essay: 'Essay',
  podcast: 'Podcast',
  video: 'Video',
  teaser: 'Subscriber preview',
};

/** Approximate reading time in minutes (200 wpm). */
export function readingTimeMinutes(text, wpm = 200) {
  const words = String(text || '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[#>*_`\[\]()!-]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / wpm));
}
