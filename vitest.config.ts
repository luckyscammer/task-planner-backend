import { defineConfig } from 'vitest/config'
import * as path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: "v8",
      reporter: ['text', 'html'],
      exclude: [
        'src/generated/**',
        'prisma/**',
        'tests/**',
        'src/routes/**',
        'src/controllers/**',
        'src/middleware/**',
        'src/utils/**',
        'src/validators/**',
        'src/config/**',
        'src/services/auth.service.ts',
        'src/services/auth.service.ts',
        'src/server.ts',
        'src/app.ts',
        'vitest.config.ts',
      ],
    },
  },
})
