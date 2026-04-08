import { fileURLToPath, URL } from 'node:url'

import VueI18nVitePlugin from '@intlify/unplugin-vue-i18n/vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { dirname, resolve } from 'path'
import Icons from 'unplugin-icons/vite'
import zipPack from 'vite-plugin-zip-pack'
import svgLoader from 'vite-svg-loader'
import { defineConfig } from 'vitest/config'

import { useHttpsConfig } from './src/composables/useHttpsConfig'
import { htmlFiles, port, projectName } from './vite.config.shared'

// https://vitejs.dev/config/
export default defineConfig({
  base: `/${projectName}/`,
  plugins: [
    vue(),
    tailwindcss(),
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
      '~': fileURLToPath(new URL('.', import.meta.url)),
    },
  },
  server: {
    port,
    https: useHttpsConfig() || undefined,
  },
  build: {
    rolldownOptions: {
      input: htmlFiles,
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('axios')) return 'axios'
            if (id.includes('dayjs')) return 'dayjs'
            if (id.includes('lodash-es')) return 'lodash'
            if (id.includes('exceljs')) return 'exceljs'
            if (id.includes('wangeditor')) return 'wangeditor'
            if (id.includes('heic-convert')) return 'heic-convert'
            if (id.includes('air-datepicker')) return 'air-datepicker'
            if (id.includes('libheif-js')) return 'libheif-js'
            return 'vendor'
          }
        },
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
      enabled: true,
      reporter: ['text', 'json', 'html'],
    },
  },
})
