const path = require('path');
const HTMLWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");


// 要在开发和生产构建之间，消除 webpack.config.js 的差异，你可能需要环境变量。

// webpack 命令行环境配置中，通过设置 --env 可以使你根据需要，传入尽可能多的环境变量。在 webpack.config.js 文件中可以访问到这些环境变量。例如，--env.production 或 --env.NODE_ENV=local（NODE_ENV 通常约定用于定义环境类型，查看这里）。

// webpack --env.NODE_ENV=local --env.production --progress
// 如果设置 env 变量，却没有赋值，--env.production 默认将 --env.production 设置为 true。还有其他可以使用的语法。有关详细信息，请查看 webpack CLI 文档。

const webpack = require('webpack')
module.exports = env => {
  // Use env.<YOUR VARIABLE> here:
  console.log('NODE_ENV: ', env.NODE_ENV); // 'local'
  console.log('Production: ', env.production); // true
  console.log(env)

  return {
    // mode: 'development',
    entry: path.resolve(__dirname, 'src/index.js'),
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist')
    },
    plugins: [
      new CleanWebpackPlugin([path.resolve(__dirname, "dist")]),
      new HTMLWebpackPlugin({
        title: "Code Splitting",
        hash: true
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(env.NODE_ENV),
        'process.env.production': JSON.stringify(env.production)
      })
    ]
  };
};