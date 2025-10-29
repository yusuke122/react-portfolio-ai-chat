import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import sass from 'sass'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        implementation: sass,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    open: true,
    cors: true,
    proxy: {
      // ローカル開発では Vite が /api を開発用 API サーバーへプロキシ
      '/api': {
        target: 'http://localhost:8787',
        changeOrigin: true,
      },
    },
  },
  base: './', // 相対パスでアセットを読み込む
});