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
        factory: fileURLToPath(new URL('./entries/factory.html', import.meta.url)),
        adapter: fileURLToPath(new URL('./entries/adapter.html', import.meta.url)),
        decorator: fileURLToPath(new URL('./entries/decorator.html', import.meta.url)),
        observer: fileURLToPath(new URL('./entries/observer.html', import.meta.url)),
        singleton: fileURLToPath(new URL('./entries/singleton.html', import.meta.url)),
        visitor: fileURLToPath(new URL('./entries/visitor.html', import.meta.url)),
        prototype: fileURLToPath(new URL('./entries/prototype.html', import.meta.url)),
        composite: fileURLToPath(new URL('./entries/composite.html', import.meta.url)),
        command: fileURLToPath(new URL('./entries/command.html', import.meta.url)),
      },
    },
  },
})
