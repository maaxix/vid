import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  //base:"/vid",
  server: {
    port: 3500,
    open: true
  },
  build: {
    chunkSizeWarningLimit: 1000, // Adjust chunk size warning limit
    rollupOptions: {
      output: {
        manualChunks: {
          // You can manually split chunks here if needed
          react: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
});