import { defineConfig } from 'vitest/config';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: () => 'gauge-card.js',
    },
    outDir: 'dist',
    target: 'es2022',
    minify: true,
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
