import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://playradarhub-backend-54816317792.us-central1.run.app',
        changeOrigin: true,
        secure: true,
        ws: false,
      },
    },
  },
});