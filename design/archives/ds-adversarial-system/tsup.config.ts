import { defineConfig } from 'tsup';

export default defineConfig({
  entry: { 'index.es': 'src/index.ts' },
  format: ['esm'],
  dts: { entry: { index: 'src/index.ts' } },
  splitting: false,
  sourcemap: false,
  clean: true,
});
