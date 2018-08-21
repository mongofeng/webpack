const HtmlWebpackPlugin = require('html-webpack-plugin'); // 生成index.html模板自动插入打包后的script
const CleanWebpackPlugin = require('clean-webpack-plugin'); // 构建前清理 /dist 文件夹
const path = require('path');
module.exports = {
  mode: 'development',
  devtool: 'eval-source-map',
  entry: __dirname + '/src/main.js',
  // entry: {
  //   app: path.resolve(__dirname, 'src/main.js'),
  //   element: path.resolve(__dirname, 'src/element.js'),
  // },

  output: {
    path: path.resolve(__dirname, 'dist'), // 打包后存放的文件夹
    filename: 'app.js' // 打包后的文件
    // filename: '[name].app.js' // 打包后的文件
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
    
  ]
}