const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    main: path.resolve(__dirname, '../src/app.ts')
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)?$/,
        exclude: [/node_modules/, /build/, /dist/],
        use: [
          {
            loader: 'ts-loader'
          }
        ]
      },
      {
        test: /\.(?:png|jpg|jpeg|gif|ico)$/i,
        type: 'asset/resource'
      },
      {
        test: /\.(?:mp3)$/i,
        loader: 'file-loader',
        options: {
          name: './assets/sounds/[contenthash].[ext]',
        }
      },
      {
        test: /\.(?:woff(2)?|eot|ttf|otf|svg)$/i,
        type: 'asset/inline'
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../src/index.html')
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      linkType: true
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: './src/public', to: './media'}
      ]
    }),
    new NodePolyfillPlugin(),
  ]
};
