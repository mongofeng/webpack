const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  mode: 'production',
  devtool: 'eval-source-map',
  // entry: __dirname + '/src/main.js',
  entry: {
    app: __dirname + '/src/main.js',
    element: __dirname + '/src/element.js'
  },

  output: {
    path: __dirname +  '/dist', // 打包后存放的文件夹
    // filename: 'app.js' // 打包后的文件
    filename: '[name].app.js' // 打包后的文件
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
    new HtmlWebpackPlugin({
      hash: true,
      template:  __dirname + '/src/index.html'
    })
  ]
}