import VueI18nVitePlugin from '@intlify/unplugin-vue-i18n/vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { resolve, dirname } from 'path'
import Icons from 'unplugin-icons/vite'
import topLevelAwait from 'vite-plugin-top-level-await'
import zipPack from 'vite-plugin-zip-pack'
import svgLoader from 'vite-svg-loader'
import { defineConfig } from 'vitest/config'
import { projectName, htmlFiles, port } from './vite.config.shared'

// https://vitejs.dev/config/
export default defineConfig({
  base: `/${projectName}/`,
  plugins: [
    vue(),
    topLevelAwait(),
    VueI18nVitePlugin({
      include: [resolve(dirname(fileURLToPath(import.meta.url)), './plugins/lang/*.ts')],
    }),
    svgLoader(),
    Icons({
      autoInstall: true,
    }),
    zipPack({
      outFileName: `${projectName}.zip`,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port,
  },
  build: {
    rollupOptions: {
      input: htmlFiles,
      output: {
        chunkFileNames() {
          const date = new Date().toISOString().split('T')[0].replaceAll('-', '')

          return `${projectName}-assets/[name]_${date}_[hash:6].js`
        },
        entryFileNames() {
          const date = new Date().toISOString().split('T')[0].replaceAll('-', '')

          return `${projectName}-assets/[name]_${date}_[hash:6].js`
        },
        assetFileNames() {
          const date = new Date().toISOString().split('T')[0].replaceAll('-', '')

          return `${projectName}-assets/[name]_${date}_[hash:6].[ext]`
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/vitest/setup.ts',
    include: ['./src/tests/vitest/**/*.(spec|test).ts'],
    coverage: {
      all: false,
      enabled: true,
      reporter: ['text', 'json', 'html'],
    },
  },
})
