import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwind from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwind()],
  resolve: {
    alias: {
      '@logo': path.resolve(__dirname, 'public'),
    },
  },
  server: {
    proxy: {
      '/api': 'http://localhost:8081',
      '/ws': {
        target: 'ws://localhost:8081',
        ws: true,
      },
    },
    fs: {
      allow: [path.resolve(__dirname)],
    },
  },
})
