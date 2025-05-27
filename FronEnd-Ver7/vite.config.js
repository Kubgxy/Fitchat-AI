import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.js'
  },
  server: {
    port: 5555,  // ✅ ใส่พอร์ตที่ต้องการ เช่น 5173
  },
})