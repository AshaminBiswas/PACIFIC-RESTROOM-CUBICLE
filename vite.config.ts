/// <reference types="vitest" />
import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Load ALL env vars (including non-VITE_ ones) for server-side use only.
  // These are NEVER injected into the client bundle — loadEnv with '' prefix
  // makes them available here in the config but Vite still won't expose
  // non-VITE_ vars to import.meta.env.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      // The React and Tailwind plugins are both required for Make, even if
      // Tailwind is not being actively used – do not remove them
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        // Alias @ to the src directory
        '@': path.resolve(__dirname, './src'),
      },
    },

    define: {
      __BUILD_DATE__: JSON.stringify(new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' })),
    },

    // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
    assetsInclude: ['**/*.svg', '**/*.csv'],

    server: {
      proxy: {
        // Dev proxy: injects the NVIDIA API key server-side so the browser
        // never holds the key. In production the Vercel function does the same.
        '/api/nvidia': {
          target: 'https://integrate.api.nvidia.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/nvidia/, ''),
          headers: env.NVIDIA_API_KEY
            ? { Authorization: `Bearer ${env.NVIDIA_API_KEY}` }
            : {},
        },
      },
    },

    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('lucide-react')) return 'lucide';
              if (id.includes('motion')) return 'motion';
              if (id.includes('@supabase')) return 'supabase';
              return 'vendor';
            }
          },
        },
      },
    },

    // ── Vitest configuration ─────────────────────────────────────
    test: {
      globals: true,
      environment: 'jsdom',
      // On Windows paths with spaces, forked workers can fail to boot.
      // Threads pool is stable for this project and avoids worker startup timeouts.
      pool: 'threads',
      setupFiles: ['./src/test/setup.ts'],
      css: false,
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html'],
        include: ['src/lib/**/*.ts'],
      },
    },
  }
})
