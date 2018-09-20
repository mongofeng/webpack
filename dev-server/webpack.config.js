const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 生成index.html模板自动插入打包后的script
const CleanWebpackPlugin = require('clean-webpack-plugin'); // 构建前清理 /dist 文件夹
const webpack = require('webpack');
module.exports = {
  mode: 'production',
  devtool: 'inline-source-map',
  entry: path.resolve(__dirname, 'src/main.js'),
  output: {
    path: path.resolve(__dirname, 'dist'), // 打包后存放的文件夹
    filename: 'app.js' // 打包后的文件
  },

  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    hot: true,
    host: 'localhost'
  },

  performance: {
    hints: false
  },

  module: {
    rules: [{
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader'
      ]
    }]
  },

  plugins: [
    new CleanWebpackPlugin([path.resolve(__dirname, 'dist')]),
    new HtmlWebpackPlugin({
      hash: true,
      template:  path.resolve(__dirname, 'src/index.html')
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
}