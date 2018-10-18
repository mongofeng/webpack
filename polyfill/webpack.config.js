const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: "inline-source-map",
  entry: {
    polyfills: path.resolve(__dirname, "src/polyfills.js"),
    index: path.resolve(__dirname, "src/index.js")
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  plugins: [
    new CleanWebpackPlugin([path.resolve(__dirname, "dist")]),
    new HTMLWebpackPlugin({
      title: "Code Splitting",
      hash: true,
      template: path.resolve(__dirname, "src/index.html")
    })
  ]
};
