import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// VITE_BASE được GitHub Actions set thành "/<tên-repo>/" khi deploy lên GitHub Pages.
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
  build: { chunkSizeWarningLimit: 700 },
})
