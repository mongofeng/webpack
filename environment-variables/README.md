# 使用环境变量

默认情况下，根据`webpack.config.js`中的`mode`设置环境

- mode：'production': process.env.NODE_ENV为production
- mode：'development': process.env.NODE_ENV为development

但是使用 webpack 内置的`webpack.DefinePlugin`能改变依赖定义这个变量

```
// 使用 webpack 内置的 DefinePlugin 为所有的依赖定义这个变量
module.exports = merge(common, {
  devtool: 'source-map',
  mode: 'development',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ]
 });
```

要在[开发](https://www.webpackjs.com/guides/development)和[生产构建](https://www.webpackjs.com/guides/production)之间，消除 `webpack.config.js` 的差异，你可能需要环境变量。

webpack 命令行[环境配置](https://www.webpackjs.com/api/cli/#environment-options)中，通过设置 `--env` 可以使你根据需要，传入尽可能多的环境变量。在 `webpack.config.js` 文件中可以访问到这些环境变量。例如，`--env.production` 或 `--env.NODE_ENV=local`（`NODE_ENV` 通常约定用于定义环境类型，查看[这里](https://dzone.com/articles/what-you-should-know-about-node-env)）。

```
webpack --env.NODE_ENV=local --env.production --progress
```

> 如果设置 `env` 变量，却没有赋值，`--env.production` 默认将 `--env.production` 设置为 `true`。还有其他可以使用的语法。有关详细信息，请查看 [webpack CLI](https://www.webpackjs.com/api/cli/#environment-options) 文档。

然而，你必须对 webpack 配置进行一处修改。通常，`module.exports` 指向配置对象。要使用 `env` 变量，你必须将 `module.exports` 转换成一个函数：

**webpack.config.js**

```
module.exports = env => {
  // Use env.<YOUR VARIABLE> here:
  console.log('NODE_ENV: ', env.NODE_ENV) // 'local'
  console.log('Production: ', env.production) // true

  return {
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist')
    }
  }
}
```

但是环境配置只能传到webpack.config.js中不能放到js中，需要`DefinePlugin` 允许创建一个在**编译**时可以配置的全局常量。这可能会对开发模式和发布模式的构建允许不同的行为非常有用。如果在开发构建中，而不在发布构建中执行日志记录，则可以使用全局常量来决定是否记录日志。