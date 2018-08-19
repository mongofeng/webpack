const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  mode: 'production',
  devtool: 'eval-source-map',
  entry: __dirname + '/src/main.js',

  output: {
    path: path.resolve(__dirname, 'dist'), // 打包后存放的文件夹
    filename: 'app.js' // 打包后的文件
  },
  plugins: [
    new HtmlWebpackPlugin({
      hash: true,
      template:  __dirname + '/src/index.html'
    })
  ]
}