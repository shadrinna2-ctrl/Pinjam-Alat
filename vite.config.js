import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: Number(process.env.PORT) || 3000,
    // Host preview diberikan lewat environment saat dijalankan di cloud/VM.
    allowedHosts: (process.env.DEV_ALLOWED_HOST || '')
      .split(',')
      .map((host) => host.trim())
      .filter(Boolean),
  },
})
