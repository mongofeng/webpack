const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack')
const path = require('path')
module.exports = merge(common, {
  devtool: 'inline-source-map',
  mode: 'development',
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    hot: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin() // 热更新必然要加
  ]
})