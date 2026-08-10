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
    canonical: z.string().url().optional(),
    substackUrl: z.string().url().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  });
}
