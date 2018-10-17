const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, 'src/index.js'),
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
       title: 'Caching'
    })
  ],
  output: {
    filename: '[name].[chunkhash].js',
    path: path.resolve(__dirname, 'dist')
  }
};