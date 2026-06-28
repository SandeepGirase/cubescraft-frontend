import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Production optimization settings
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // Generate sourcemaps for production debugging (optional - disable in very sensitive environments)
    sourcemap: false,
    // Chunk size warnings
    chunkSizeWarningLimit: 1000,
    // Optimize chunks for better caching
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor-react';
            }
            if (id.includes('i18next') || id.includes('react-i18next')) {
              return 'vendor-i18n';
            }
            if (id.includes('axios')) {
              return 'vendor-axios';
            }
          }
        },
        // Optimize asset file names for better caching
        entryFileNames: 'js/[name]-[hash].js',
        chunkFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const fileName = assetInfo.name || '';
          const info = fileName.split('.');
          const ext = info.length > 1 ? info[info.length - 1] : '';

          if (/png|jpe?g|gif|svg/.test(ext)) {
            return `images/[name]-[hash][extname]`;
          } else if (/woff|woff2|eot|ttf|otf/.test(ext)) {
            return `fonts/[name]-[hash][extname]`;
          } else if (ext === 'css') {
            return `css/[name]-[hash][extname]`;
          }

          return `assets/[name]-[hash][extname]`;
        },
      },
    },
  },
  server: {
    // Development server configuration
    port: 3000,
    open: false,
    cors: true,
  },
  resolve: {
    alias: {
      // Add path aliases if needed
    },
  },
})

