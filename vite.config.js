import { fileURLToPath } from 'node:url'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vitest/config'

const clientEntry = fileURLToPath(new URL('index.html', import.meta.url))
const serverEntry = fileURLToPath(
  new URL('src/server/index.js', import.meta.url),
)

export default defineConfig(({ isSsrBuild }) => ({
  base: './',
  // Pure-SPA dev server: client-side rendering only, like the old
  // webpack-dev-server. SSR runs only in production via `npm start`.
  appType: 'spa',
  server: { port: 9000 },
  build: {
    outDir: isSsrBuild ? 'dist/server' : 'dist',
    assetsDir: 'assets',
    cssCodeSplit: false,
    rollupOptions: {
      input: isSsrBuild ? serverEntry : clientEntry,
      output: isSsrBuild
        ? // SSR: just emit the server entry as index.js
          { entryFileNames: 'index.js' }
        : // Client: keep the legacy, un-hashed asset URLs the server
          // view emits (assets/bundle.js, assets/main.css). Hashing
          // lands in Phase 3.
          {
            entryFileNames: 'assets/bundle.js',
            assetFileNames: (assetInfo) => {
              const name = assetInfo.names?.[0] ?? ''
              return name.endsWith('.css')
                ? 'assets/main.css'
                : 'assets/[name][extname]'
            },
          },
    },
  },
  plugins: [
    process.env.ANALYZE
      ? visualizer({ filename: 'stats.html', open: false })
      : undefined,
  ],
  test: {
    environment: 'node',
    globals: true,
    include: ['__tests__/**/*.test.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**/*.js'],
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 75,
        statements: 90,
      },
    },
  },
}))
