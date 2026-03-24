import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {

          // 🔹 NODE MODULES (vendor)
          if (id.includes('node_modules')) {

            // React core
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }

            // UI / icons
            if (id.includes('lucide-react')) {
              return 'vendor-ui';
            }

            // Supabase
            if (id.includes('@supabase')) {
              return 'vendor-supabase';
            }

            // Resto de librerías de node_modules
            return 'vendor';
          }

          // 🔹 FEATURES (tu app)
          if (id.includes('/Memory/')) {
            return 'feature-memory';
          }

          if (id.includes('/Timeline/')) {
            return 'feature-timeline';
          }

          if (id.includes('/Auth/')) {
            return 'feature-auth';
          }

          if (id.includes('/services/')) {
            return 'services';
          }

          // Si no coincide con nada, no separar
          return undefined;
        }
      }
    }
  }
});