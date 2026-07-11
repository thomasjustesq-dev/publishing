import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const essays = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/essays' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date(),
    hero: z.string().optional(),
    substackUrl: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { essays };
