import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwind from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwind()],
  resolve: {
    alias: {
      '@logo': path.resolve(__dirname, '../logo'),
    },
  },
  server: {
    proxy: {
      '/api': 'http://localhost:8081',
      '/ws': {
        target: 'http://localhost:8081',
        ws: true,
        // 靜默處理 proxy 斷線 log
        on: {
          error: () => {},
          proxyReqWs: () => {},
        },
      },
    },
    fs: {
      allow: [path.resolve(__dirname), path.resolve(__dirname, '../logo')],
    },
  },
})
