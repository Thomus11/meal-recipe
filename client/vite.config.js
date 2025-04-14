import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5555', // Replace with your Flask back-end URL
        changeOrigin: true, // Ensures requests appear as originating from the proxy
        rewrite: (path) => path.replace(/^\/api/, ''), // Removes "/api" prefix before forwarding
      },
    },
  },
});
