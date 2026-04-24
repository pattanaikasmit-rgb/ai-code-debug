import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const sharedHostConfig = {
  host: '0.0.0.0',
  port: 5174,
  strictPort: true,
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const backendUrl = env.REACT_APP_API_URL || env.VITE_API_BASE_URL || 'http://localhost:5000'

  return {
    envPrefix: ['VITE_', 'REACT_APP_'],
    plugins: [react(), tailwindcss()],
    server: {
      ...sharedHostConfig,
      proxy: {
        '/api': {
          target: backendUrl,
          changeOrigin: true,
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              // Keep strict backend CLIENT_URL while allowing local dev via proxy.
              // Backend treats requests without Origin as non-browser/server-side.
              proxyReq.removeHeader('origin')
            })
          },
        },
      },
    },
    preview: sharedHostConfig,
    build: {
      outDir: 'build',
      target: 'es2020',
      cssCodeSplit: true,
      minify: 'esbuild',
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('monaco-editor') || id.includes('@monaco-editor/react')) {
              return 'editor'
            }

            if (id.includes('react')) {
              return 'react'
            }
          },
        },
      },
    },
  }
})
