import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import vue from '@vitejs/plugin-vue'
import { createCSSJSImportPlugin } from 'vite-css-in-js'
import vueJsx from '@vitejs/plugin-vue-jsx'

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
      vueJsx(),
      vue({
        template: {
          compilerOptions: {
            isCustomElement: (tag) => tag === 'center'
          }
        }
      }),
      Components({
        resolvers: [
          AntDesignVueResolver({
            importStyle: false
          })
        ]
      }),
      createCSSJSImportPlugin()
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
