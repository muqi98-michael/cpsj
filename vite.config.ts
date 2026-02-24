import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 部署到 GitHub Pages 时，仓库名作为子路径
// 若仓库名不是 cpsj，请修改此处
export default defineConfig({
  plugins: [react()],
  base: '/cpsj/',
})
