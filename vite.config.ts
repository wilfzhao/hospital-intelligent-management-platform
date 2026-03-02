import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/hospital-intelligent-management-platform/',   // 这里改成你的 GitHub 仓库名
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    outDir: 'dist',
  },
  server: {
    host: '0.0.0.0',
    port: 3000
  }
})