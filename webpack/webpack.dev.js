const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  devServer: {
    port: 3001,
    open: {
      app: ['chrome', '--incognito'],
      // app: ['google-chrome', '--incognito'],
    },
    hot: true,
    compress: true,
    contentBase: path.resolve(__dirname, './src/public'),
    overlay: true,
    historyApiFallback: true,
  }
}