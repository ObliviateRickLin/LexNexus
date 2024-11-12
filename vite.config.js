import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import fs from 'fs'

export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'copy-manifest',
      closeBundle() {
        // 复制必要文件
        const files = {
          'src/manifest.json': 'dist/manifest.json',
          'public/popup.html': 'dist/popup.html',
          'public/base.css': 'dist/base.css'
        }
        
        for (const [src, dest] of Object.entries(files)) {
          fs.copyFileSync(resolve(__dirname, src), resolve(__dirname, dest))
        }
      }
    }
  ],
  css: {
    postcss: {
      plugins: []
    }
  },
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'src/popup/main.js'),
        content: resolve(__dirname, 'src/content/content.js'),
        background: resolve(__dirname, 'src/background/background.js')
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') {
            return 'popup.css'
          }
          return '[name][extname]'
        }
      }
    },
    outDir: 'dist',
    assetsDir: '.',
    emptyOutDir: true
  }
}) 