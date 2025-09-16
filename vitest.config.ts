import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    environment: 'happy-dom',
    include: ['tests/**/*.spec.ts'],
    globals: true
  },
  resolve: {
    alias: {
      '~': resolve(__dirname, './app'),
      '@': resolve(__dirname, './app'),
      '#app': resolve(__dirname, './app'),
      '#build': resolve(__dirname, './app'),
    },
  },
  define: {
    'import.meta.client': 'false',
    'import.meta.server': 'true',
    'process.client': 'false',
    'process.server': 'true',
  }
})
