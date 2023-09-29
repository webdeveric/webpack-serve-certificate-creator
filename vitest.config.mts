import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    setupFiles: './setupVitest.mts',
    include: ['./test/**/*.test.ts'],
    coverage: {
      provider: 'v8',
    },
  },
});
