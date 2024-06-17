import VueI18nVitePlugin from '@intlify/unplugin-vue-i18n/vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { resolve, dirname } from 'path'
import Icons from 'unplugin-icons/vite'
import { defineConfig } from 'vite'
import topLevelAwait from 'vite-plugin-top-level-await'
import zipPack from 'vite-plugin-zip-pack'
import svgLoader from 'vite-svg-loader'
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
    },
    assetsDir: `${projectName}-assets`,
  },
})
