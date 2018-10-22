const HtmlWebpackPlugin = require("html-webpack-plugin"); // 生成index.html模板自动插入打包后的script
const CleanWebpackPlugin = require("clean-webpack-plugin"); // 构建前清理 /dist 文件夹
const webpack = require('webpack')
const path = require("path");

// 如果预先定义过环境变量，就将其赋值给`ASSET_PATH`变量，否则赋值为根目录
const ASSET_PATH = process.env.ASSET_PATH || '/';
console.log(ASSET_PATH)
module.exports = {
  mode: "development",
  entry: path.resolve(__dirname, "src/index.js"),

  output: {
    path: path.resolve(__dirname, "dist"), // 打包后存放的文件夹
    filename: "app.[chunkhash].js" // 打包后的文件
  },

  plugins: [
    new CleanWebpackPlugin([path.resolve(__dirname, "dist")]),
    new HtmlWebpackPlugin({
      hash: true,
      title: "pwa"
    }),
    // 该插件帮助我们安心地使用环境变量
    new webpack.DefinePlugin({
      'process.env.ASSET_PATH': JSON.stringify(ASSET_PATH)
    })
  ]
};


// __webpack_public_path__ 待续
