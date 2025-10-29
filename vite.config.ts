import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    open: true,
    // SPA のルーティングに必要な設定
    cors: true,
    middleware: [
      (req, res, next) => {
        // SPA のための History API Fallback
        if (req.url?.includes('.')) {
          next();
        } else {
          req.url = '/';
          next();
        }
      },
    ],
  },
  base: './', // 相対パスでアセットを読み込む
});