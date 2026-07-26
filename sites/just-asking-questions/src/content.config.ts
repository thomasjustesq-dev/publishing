import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const essays = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/essays' }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1).optional(),
    date: z.coerce.date().refine((value: Date) => value.getTime() <= Date.now(), {
      message: 'essay date cannot be in the future',
    }),
    updated: z.coerce.date().optional(),
    hero: z.string().optional(),
    canonical: z.string().url().optional(),
    substackUrl: z.string().url().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { essays };
