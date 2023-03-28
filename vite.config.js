import { defineConfig } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { createStyleImportPlugin, AntdResolve } from 'vite-plugin-style-import'

export default defineConfig({
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
        },
    },
    plugins: [
        vue(),
        vueJsx(),
        createStyleImportPlugin({
            resolves: [AntdResolve()],
            libs: [{
                libraryName: 'ant-design-vue',
                esModule: true,
                resolveStyle: (name) => {
                    return `ant-design-vue/es/${name}/style/css`
                }
            }]
        })
    ],
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: '@import \'@/assets/css/mixin.scss\';'
            }
        }
    }
})
