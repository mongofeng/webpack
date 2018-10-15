const merge = require('webpack-merge');
//  const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.common.js');
const webpack = require('webpack')



// 避免在生产中使用 inline-*** 和 eval-***，因为它们可以增加 bundle 大小，并降低整体性能。

// 指定环境
// 许多 library 将通过与 process.env.NODE_ENV 环境变量关联，以决定 library 中应该引用哪些内容
// 使用 webpack 内置的 DefinePlugin 为所有的依赖定义这个变量
module.exports = merge(common, {
  devtool: 'source-map',
  mode: 'production',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ]
 });
// module.exports = merge(common, {
//   devtool: 'source-map',
//   mode: 'production',
//   plugins: [
//      new UglifyJSPlugin({
//       sourceMap: true
//      })
//    ]
//  });