import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: true,
    origin: 'http://vc9abe67.natappfree.cc',
    allowedHosts: ['vc9abe67.natappfree.cc', '.natappfree.cc', '.natapp.cn', '.ngrok-free.dev', '.ngrok.io'],
    proxy: {
      '/api': {
        target: 'http://0.0.0.0:8082',
        changeOrigin: true,
        secure: false,
      },
    },
    hmr: {
      protocol: 'ws',
      host: 'vc9abe67.natappfree.cc',
    },
    cors: true,
  }
})
