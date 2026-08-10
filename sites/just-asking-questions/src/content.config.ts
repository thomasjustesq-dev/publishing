import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { essayCollectionSchema } from '@pub/site-kit';

const essays = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/essays' }),
  schema: essayCollectionSchema(z),
});

export const collections = { essays };
