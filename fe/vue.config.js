const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})
module.exports = {
  devServer: {
    proxy: {
      '/public': {
        target: 'http://localhost:5007',
        changeOrigin: true,
      },
    },
  },
};
