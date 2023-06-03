import { defineConfig } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import vue from '@vitejs/plugin-vue'
import Unocss from 'unocss/vite'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Unocss(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    })
  ],
  base: './',
  server: {
    host: "0.0.0.0", //打开显示本地地址
    open: true,// 是否自动启动浏览器
    port: 5173,//端口号
    proxy: { // 本地开发环境通过代理实现跨域
      // 正则表达式写法
      // '/myShareApi': {
      //   target: 'https://myshare.cc/api/v1', // 后端服务实际地址
      //   changeOrigin: true, //开启代理
      //   rewrite: (path) => path.replace(/^\/api/, '')
      // }
    }
  }
})