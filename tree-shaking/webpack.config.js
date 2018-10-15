// 我们已经可以通过 import 和 export 语法，找出那些需要删除的“未使用代码(dead code)”，
// 然而，我们不只是要找出，还需要在 bundle 中删除它们。
// 为此，我们将使用 -p(production) 这个 webpack 编译标记，来启用 uglifyjs 压缩插件


// 注意，--optimize-minimize 标记也会在 webpack 内部调用 UglifyJsPlugin。

// 从 webpack 4 开始，也可以通过 "mode" 配置选项轻松切换到压缩输出，只需设置为 "production"。

// 注意，也可以在命令行接口中使用 --optimize-minimize 标记，来使用 UglifyJSPlugin
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 生成index.html模板自动插入打包后的script
const CleanWebpackPlugin = require('clean-webpack-plugin'); // 构建前清理 /dist 文件夹
module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, 'src/main.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.js'

  },
  plugins: [
    new CleanWebpackPlugin([path.resolve(__dirname, 'dist')]),
    new HtmlWebpackPlugin({
      hash: true,
      template:  path.resolve(__dirname, 'src/index.html')
    })
  ]
}