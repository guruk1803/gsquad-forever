import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    strictPort: false, // Allow Vite to use next available port if 3001 is taken
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        ws: true, // Enable websocket proxying
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, res) => {
            console.log('Proxy error:', err.message)
            console.log('⚠️  Make sure the backend server is running on port 5000')
            console.log('   Run: cd server && npm run dev')
          })
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log(`[PROXY] ${req.method} ${req.url} -> http://localhost:5000${req.url}`)
          })
        },
      }
    }
  }
})

