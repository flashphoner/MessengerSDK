const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common({ production: false }), {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    port: 3000,
    historyApiFallback: true,
    open: true,
    hot: true,
    client: {
      overlay: false,
    },
  },
});
