// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from "@tailwindcss/vite"
// import path from "path"

// export default defineConfig({
//   plugins: [react(),tailwindcss()],
//   resolve: {
//     alias: {
//       '@': path.resolve(__dirname, './src'),
//       // Add these if you're using axios or other common packages
//       'axios': 'axios',
//       'react': path.resolve(__dirname, './node_modules/react'),
//       'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
//     },
//   },
// })

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export default defineConfig({
  plugins: [react(), ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // These aliases aren't typically needed as Vite handles node_modules automatically
    },
  },
  server: {
    // Proxy configuration for API requests
    proxy: {
      '/api': {
        target: 'http://192.168.1.70:8000', // Your backend URL
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false, // Only for development with self-signed certificates
        // Additional headers if needed
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
      },
      // Add proxy for Sanctum CSRF cookie if using Laravel Sanctum
      '/sanctum': {
        target: 'http://192.168.1.70:8000',
        changeOrigin: true,
        secure: false,
      }
    },
    // Enable CORS for Vite's own server (for HMR, etc.)
    cors: {
      origin: true, // Reflects the request origin
      credentials: true,
    },
    // Additional server options
    host: true, // Listen on all network interfaces
    port: 3000, // Explicit port (optional)
    strictPort: true, // Don't fall back to another port if 3000 is taken
    open: true, // Open browser on server start
  },
  // Build configuration
  build: {
     outDir: resolve(__dirname, '../express/dist'),
    emptyOutDir: true,
    sourcemap: true, // Recommended for debugging
  
  },


});