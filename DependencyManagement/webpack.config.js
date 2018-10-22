const HtmlWebpackPlugin = require("html-webpack-plugin"); // 生成index.html模板自动插入打包后的script
const CleanWebpackPlugin = require("clean-webpack-plugin"); // 构建前清理 /dist 文件夹
const path = require("path");
module.exports = {
  mode: "development",
  entry: path.resolve(__dirname, "src/main.js"),

  output: {
    path: path.resolve(__dirname, "dist"), // 打包后存放的文件夹
    filename: "app.[chunkhash].js" // 打包后的文件
  },

  plugins: [
    new CleanWebpackPlugin([path.resolve(__dirname, "dist")]),
    new HtmlWebpackPlugin({
      hash: true,
      title: "pwa"
    })
  ]
};
