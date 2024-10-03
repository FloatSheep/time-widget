import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [
      vue({
        template: {
          compilerOptions: {
            isCustomElement: (tag) => tag === 'center'
          }
        }
      })
    ],
    mode: 'production',
    build: {
      minify: 'terser',
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('ant-design-vue')) {
              return 'antd-main'
            }
            if (id.includes('@ant-design/icons-vue')) {
              return 'antd-icon'
            }
            if (id.includes('node_modules')) {
              return 'vendor'
            } else {
              return 'main'
            }
          }
        }
      }
    }
  }
})
