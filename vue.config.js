const path = require('path');
const resolve=(dir)=> {return path.join(__dirname, dir)}
module.exports = {
    publicPath: '',
    lintOnSave: false,
    assetsDir: 'static',
    productionSourceMap: false,
    configureWebpack: config => {
      if (process.env.NODE_ENV === 'production') {
        config.optimization.minimizer[0].options.terserOptions.compress.warnings = false;
        config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true;
        config.optimization.minimizer[0].options.terserOptions.compress.drop_debugger = true;
        config.optimization.minimizer[0].options.terserOptions.compress.pure_funcs = ['console.log'];
      }
    },
    chainWebpack: (config) => {
      config.resolve.alias
      .set('@', resolve('src'))
      .set('@assets',resolve('src/assets'));
      config.plugins.delete('preload')
      config.plugins.delete('prefetch')
    }
}