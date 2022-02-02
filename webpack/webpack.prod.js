const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, '..', './build'),
    filename: 'bundle-[hash].js',
    publicPath: '/',
    assetModuleFilename: 'assets/[hash][ext]',
    clean: true,
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false,
          }
        },
        extractComments: false,
      }),
    ],
  },
}