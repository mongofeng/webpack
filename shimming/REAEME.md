# shimming

[查看原文](https://webpack.js.org/guides/shimming/)|[编辑此页](https://github.com/docschina/webpack.js.org/edit/cn/src/content/guides/shimming.md)

`webpack` 编译器(compiler)能够识别遵循 ES2015 模块语法、CommonJS 或 AMD 规范编写的模块。然而，一些第三方的库(library)可能会引用一些全局依赖（例如 `jQuery` 中的 `$`）。这些库也可能创建一些需要被导出的全局变量。这些“不符合规范的模块”就是 *shimming* 发挥作用的地方。

> **我们不推荐使用全局的东西！**在 webpack 背后的整个概念是让前端开发更加模块化。也就是说，需要编写具有良好的封闭性(well contained)、彼此隔离的模块，以及不要依赖于那些隐含的依赖模块（例如，全局变量）。请只在必要的时候才使用本文所述的这些特性。

*shimming* 另外一个使用场景就是，当你希望 [polyfill](https://en.wikipedia.org/wiki/Polyfill) 浏览器功能以支持更多用户时。在这种情况下，你可能只想要将这些 polyfills 提供给到需要修补(patch)的浏览器（也就是实现按需加载）。

下面的文章将向我们展示这两种用例。

> 为了方便，本指南继续沿用[起步](https://www.webpackjs.com/guides/getting-started)中的代码示例。在继续之前，请确保你已经熟悉那些配置。

## shimming 全局变量

让我们开始第一个 shimming 全局变量的用例。在此之前，我们先看看我们的项目：

**project**

```
webpack-demo
|- package.json
|- webpack.config.js
|- /dist
|- /src
  |- index.js
|- /node_modules
```

还记得我们之前用过的 `lodash` 吗？出于演示的目的，让我们把这个模块作为我们应用程序中的一个全局变量。要实现这些，我们需要使用 `ProvidePlugin` 插件。

使用 [`ProvidePlugin`](https://www.webpackjs.com/plugins/provide-plugin) 后，能够在通过 webpack 编译的每个模块中，通过访问一个变量来获取到 package 包。如果 webpack 知道这个变量在某个模块中被使用了，那么 webpack 将在最终 bundle 中引入我们给定的 package。让我们先移除 `lodash` 的 `import` 语句，并通过插件提供它：

**src/index.js**

```
- import _ from 'lodash';
-
  function component() {
    var element = document.createElement('div');

-   // Lodash, now imported by this script
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');

    return element;
  }

  document.body.appendChild(component());
```

**webpack.config.js**

```
  const path = require('path');
+ const webpack = require('webpack');

  module.exports = {
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist')
-   }
+   },
+   plugins: [
+     new webpack.ProvidePlugin({
+       _: 'lodash'
+     })
+   ]
  };
```

本质上，我们所做的，就是告诉 webpack……

> 如果你遇到了至少一处用到 `lodash` 变量的模块实例，那请你将 `lodash` package 包引入进来，并将其提供给需要用到它的模块。

如果我们 run build，将会看到同样的输出：

```
Hash: f450fa59fa951c68c416
Version: webpack 2.2.0
Time: 343ms
    Asset    Size  Chunks                    Chunk Names
bundle.js  544 kB       0  [emitted]  [big]  main
   [0] ./~/lodash/lodash.js 540 kB {0} [built]
   [1] (webpack)/buildin/global.js 509 bytes {0} [built]
   [2] (webpack)/buildin/module.js 517 bytes {0} [built]
   [3] ./src/index.js 189 bytes {0} [built]
```

我们还可以使用 `ProvidePlugin` 暴露某个模块中单个导出值，只需通过一个“数组路径”进行配置（例如 `[module, child, ...children?]`）。所以，让我们做如下设想，无论 `join` 方法在何处调用，我们都只会得到的是 `lodash` 中提供的 `join` 方法。

**src/index.js**

```
  function component() {
    var element = document.createElement('div');

-   element.innerHTML = _.join(['Hello', 'webpack'], ' ');
+   element.innerHTML = join(['Hello', 'webpack'], ' ');

    return element;
  }

  document.body.appendChild(component());
```

**webpack.config.js**

```
  const path = require('path');
  const webpack = require('webpack');

  module.exports = {
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist')
    },
    plugins: [
      new webpack.ProvidePlugin({
-       _: 'lodash'
+       join: ['lodash', 'join']
      })
    ]
  };
```

这样就能很好的与 [tree shaking](https://www.webpackjs.com/guides/tree-shaking) 配合，将 `lodash` 库中的其他没用到的部分去除。

## 细粒度 shimming

一些传统的模块依赖的 `this` 指向的是 `window` 对象。在接下来的用例中，调整我们的 `index.js`：

```
  function component() {
    var element = document.createElement('div');

    element.innerHTML = join(['Hello', 'webpack'], ' ');
+
+   // Assume we are in the context of `window`
+   this.alert('Hmmm, this probably isn\'t a great idea...')

    return element;
  }

  document.body.appendChild(component());
```

当模块运行在 CommonJS 环境下这将会变成一个问题，也就是说此时的 `this` 指向的是 `module.exports`。在这个例子中，你可以通过使用 [`imports-loader`](https://www.webpackjs.com/loaders/imports-loader/) 覆写 `this`：

**webpack.config.js**

```
  const path = require('path');
  const webpack = require('webpack');

  module.exports = {
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist')
    },
+   module: {
+     rules: [
+       {
+         test: require.resolve('index.js'),
+         use: 'imports-loader?this=>window'
+       }
+     ]
+   },
    plugins: [
      new webpack.ProvidePlugin({
        join: ['lodash', 'join']
      })
    ]
  };
```

## 全局 exports

让我们假设，某个库(library)创建出一个全局变量，它期望用户使用这个变量。为此，我们可以在项目配置中，添加一个小模块来演示说明：

**project**

```
  webpack-demo
  |- package.json
  |- webpack.config.js
  |- /dist
  |- /src
    |- index.js
+   |- globals.js
  |- /node_modules
```

**src/globals.js**

```
var file = 'blah.txt';
var helpers = {
  test: function() { console.log('test something'); },
  parse: function() { console.log('parse something'); }
}
```

你可能从来没有在自己的源码中做过这些事情，但是你也许遇到过一个老旧的库(library)，和上面所展示的代码类似。在这个用例中，我们可以使用 [`exports-loader`](https://www.webpackjs.com/loaders/exports-loader/)，将一个全局变量作为一个普通的模块来导出。例如，为了将 `file` 导出为 `file` 以及将 `helpers.parse` 导出为 `parse`，做如下调整：

**webpack.config.js**

```
  const path = require('path');
  const webpack = require('webpack');

  module.exports = {
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist')
    },
    module: {
      rules: [
        {
          test: require.resolve('index.js'),
          use: 'imports-loader?this=>window'
-       }
+       },
+       {
+         test: require.resolve('globals.js'),
+         use: 'exports-loader?file,parse=helpers.parse'
+       }
      ]
    },
    plugins: [
      new webpack.ProvidePlugin({
        join: ['lodash', 'join']
      })
    ]
  };
```

现在从我们的 entry 入口文件中(即 `src/index.js`)，我们能 `import { file, parse } from './globals.js';`，然后一切将顺利进行。