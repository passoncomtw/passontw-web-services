import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    // 限制並發文件處理數量以避免 EMFILE 錯誤
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          mui: ['@mui/material', '@mui/icons-material', '@mui/system'],
        }
      },
      // 限制並發處理的文件數量
      maxParallelFileOps: 20,
    },
  },
  // 優化依賴預構建
  optimizeDeps: {
    include: ['@mui/material', '@mui/icons-material'],
    // 限制並發處理數量
    force: false
  },
})
