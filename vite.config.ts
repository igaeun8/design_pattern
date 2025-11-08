import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        factory: fileURLToPath(new URL('./factory.html', import.meta.url)),
        adapter: fileURLToPath(new URL('./adapter.html', import.meta.url)),
        decorator: fileURLToPath(new URL('./decorator.html', import.meta.url)),
        observer: fileURLToPath(new URL('./observer.html', import.meta.url)),
        singleton: fileURLToPath(new URL('./singleton.html', import.meta.url)),
        visitor: fileURLToPath(new URL('./visitor.html', import.meta.url)),
        prototype: fileURLToPath(new URL('./prototype.html', import.meta.url)),
        composite: fileURLToPath(new URL('./composite.html', import.meta.url)),
        command: fileURLToPath(new URL('./command.html', import.meta.url)),
      },
    },
  },
})
