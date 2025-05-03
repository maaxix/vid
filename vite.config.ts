import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base:"/vid/",
  resolve: {
    alias: {
      '@': path.resolve( __dirname,'./src'),
      '@components': path.resolve( __dirname, './src/components'),
      // Add more aliases as needed
    }
  },
  server: {
    port: 4040,
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