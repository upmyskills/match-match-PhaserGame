const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  devServer: {
    port: 3001,
    overlay: true,
    // },
    open: {
      app: ['chrome', '--incognito'],
      // app: ['google-chrome', '--incognito'],
    },
    hot: true,
    compress: true,
    contentBase: path.resolve(__dirname, './src/public'),
    historyApiFallback: true,
    // host: '0.0.0.0',
  }
}