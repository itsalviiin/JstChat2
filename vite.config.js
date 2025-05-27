import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

const newLocal = '/'
// https://vite.dev/config/
export default defineConfig({
  // publicPath: newLocal,
  base: process.env.NODE_ENV === 'production' ? '/JstChat2/' : '/',
  transpileDependencies: true,
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
