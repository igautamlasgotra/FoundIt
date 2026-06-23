import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// During local dev, the Vite server runs on :5173 and the Express API on :5000.
// This proxy forwards any /api request to Express so the frontend can call
// relative URLs (e.g. fetch('/api/health')) exactly like it will in production
// on Vercel — no environment-specific base URL needed.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
