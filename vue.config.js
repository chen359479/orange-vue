const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave:false,
  devServer: {
    port:8080,
    // proxy: 'http://127.0.0.1:8099',
    // 线上服务器
    proxy: 'http://175.24.172.244:8099'
  },
  configureWebpack: {
    externals: {
      "BMap": "BMap"
    }
  }
})


