const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");


module.exports = {
  mode: "development",
  entry: {
    main: path.resolve(__dirname, "src/index.js")
  },
  plugins: [
    new CleanWebpackPlugin([path.resolve(__dirname, "dist")])
  ],
  output: {
    filename: "webpack-numbers.js",
    libraryTarget: 'umd',
    library: 'webpackNumbers',
    path: path.resolve(__dirname, "dist")
  },
  externals: {
    lodash: {
      commonjs: 'lodash',
      commonjs2: 'lodash',
       amd: 'lodash',
       root: '_'
    }
  }
};
