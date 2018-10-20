const path = require("path");
const webpack = require("webpack");
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  mode: 'production',
  // devtool: 'inline-source-map',
  entry: path.resolve(__dirname, "src/index.js"),
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  // module: {
  //   rules: [
  //     {
  //       test: require.resolve(path.resolve(__dirname, "src/index.js")),
  //       use: 'imports-loader?this=>window'
  //      }
  //     //  {
  //     //    test: require.resolve(path.resolve(__dirname, "src/globals.js")),
  //     //    use: 'exports-loader?file,parse=helpers.parse'
  //     //  }
  //   ]
  // },
  plugins: [
    new webpack.ProvidePlugin({
      // _: "lodash"
      join: ['lodash', 'join']
    }),
    new CleanWebpackPlugin([path.resolve(__dirname, 'dist')]),
    new HTMLWebpackPlugin({
      title: 'Code Splitting'
    })
  ]
};

// webpack中imports-loader,exports-loader,expose-loader的区别
// https://blog.csdn.net/mingqingyuefeng/article/details/77937808


// 这样就能很好的与 tree shaking 配合，将 lodash 库中的其他没用到的部分去除。有疑问！！！！