const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.common');

module.exports = ({ envMode }) => {
  const envConfig = require(`./webpack.${envMode}`);
  const config = merge(baseConfig, envConfig);
  return config;
}
