import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // Default fallback string
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') || '/',
        router: (req) => {
          // You can dynamically return a target string here
          // If you want to strictly enforce the IPv4 IP address for stability:
          return 'http://127.0.0.1:8080';
        }
      }
    },
  },
});
