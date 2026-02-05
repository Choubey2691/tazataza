import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::", // Listen on all interfaces for network access
    port: 8080,
    hmr: {
      overlay: false,
    },
    // Allow CORS for mobile testing
    cors: true,
    // Allow access from network IPs
    allowedHosts: true,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Environment variable validation
  define: {
    // Ensure environment variables are available at build time
    __APP_ENV__: JSON.stringify(process.env.VITE_APP_ENV || 'development'),
  },
  // Build configuration for production
  build: {
    // Generate source maps for debugging in production
    sourcemap: mode === 'development',
    // Optimize chunks for better loading
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          supabase: ['@supabase/supabase-js'],
        },
      },
    },
  },
  // Preview configuration for production testing
  preview: {
    host: "::",
    port: 8080,
    cors: true,
    allowedHosts: true,
  },
}));
