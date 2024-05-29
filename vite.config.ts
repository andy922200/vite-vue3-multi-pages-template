import VueI18nVitePlugin from '@intlify/unplugin-vue-i18n/vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { resolve, dirname } from 'path'
import Icons from 'unplugin-icons/vite'
import { defineConfig } from 'vite'
import zipPack from 'vite-plugin-zip-pack'
import { projectName, htmlFiles, port } from './vite.config.shared'

// https://vitejs.dev/config/
export default defineConfig({
  base: `/${projectName}/`,
  plugins: [
    vue(),
    VueI18nVitePlugin({
      include: [resolve(dirname(fileURLToPath(import.meta.url)), './plugins/lang/*.ts')],
    }),
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
