## 加载 polyfills

目前为止我们所讨论的所有内容都是处理那些遗留的 package 包，让我们进入到下一个话题：**polyfills**。

有很多方法来载入 polyfills。例如，要引入 [`babel-polyfill`](https://babeljs.io/docs/usage/polyfill/) 我们只需要如下操作：

```
npm install --save babel-polyfill
```

然后使用 `import` 将其添加到我们的主 bundle 文件：

**src/index.js**

```
+ import 'babel-polyfill';
+
  function component() {
    var element = document.createElement('div');

    element.innerHTML = join(['Hello', 'webpack'], ' ');

    return element;
  }

  document.body.appendChild(component());
```

> 请注意，我们没有将 `import` 绑定到变量。这是因为只需在基础代码(code base)之外，再额外执行 polyfills，这样我们就可以假定代码中已经具有某些原生功能。

polyfills 虽然是一种模块引入方式，但是**并不推荐在主 bundle 中引入 polyfills**，因为这不利于具备这些模块功能的现代浏览器用户，会使他们下载体积很大、但却不需要的脚本文件。

让我们把 `import` 放入一个新文件，并加入 [`whatwg-fetch`](https://github.com/github/fetch) polyfill：

```
npm install --save whatwg-fetch
```

**src/index.js**

```
- import 'babel-polyfill';
-
  function component() {
    var element = document.createElement('div');

    element.innerHTML = join(['Hello', 'webpack'], ' ');

    return element;
  }

  document.body.appendChild(component());
```

**project**

```
  webpack-demo
  |- package.json
  |- webpack.config.js
  |- /dist
  |- /src
    |- index.js
    |- globals.js
+   |- polyfills.js
  |- /node_modules
```

**src/polyfills.js**

```
import 'babel-polyfill';
import 'whatwg-fetch';
```

**webpack.config.js**

```
  const path = require('path');
  const webpack = require('webpack');

  module.exports = {
-   entry: './src/index.js',
+   entry: {
+     polyfills: './src/polyfills.js',
+     index: './src/index.js'
+   },
    output: {
-     filename: 'bundle.js',
+     filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
    },
    module: {
      rules: [
        {
          test: require.resolve('index.js'),
          use: 'imports-loader?this=>window'
        },
        {
          test: require.resolve('globals.js'),
          use: 'exports-loader?file,parse=helpers.parse'
        }
      ]
    },
    plugins: [
      new webpack.ProvidePlugin({
        join: ['lodash', 'join']
      })
    ]
  };
```

如此之后，我们可以在代码中添加一些逻辑，根据条件去加载新的 `polyfills.bundle.js` 文件。你该如何决定，依赖于那些需要支持的技术以及浏览器。我们将做一些简单的试验，来确定是否需要引入这些 polyfills：

**dist/index.html**

```
  <!doctype html>
  <html>
    <head>
      <title>Getting Started</title>
+     <script>
+       var modernBrowser = (
+         'fetch' in window &&
+         'assign' in Object
+       );
+
+       if ( !modernBrowser ) {
+         var scriptElement = document.createElement('script');
+
+         scriptElement.async = false;
+         scriptElement.src = '/polyfills.bundle.js';
+         document.head.appendChild(scriptElement);
+       }
+     </script>
    </head>
    <body>
      <script src="index.bundle.js"></script>
    </body>
  </html>
```

现在，我们能在 entry 入口文件中，通过 `fetch` 获取一些数据：

**src/index.js**

```
  function component() {
    var element = document.createElement('div');

    element.innerHTML = join(['Hello', 'webpack'], ' ');

    return element;
  }

  document.body.appendChild(component());
+
+ fetch('https://jsonplaceholder.typicode.com/users')
+   .then(response => response.json())
+   .then(json => {
+     console.log('We retrieved some data! AND we\'re confident it will work on a variety of browser distributions.')
+     console.log(json)
+   })
+   .catch(error => console.error('Something went wrong when fetching this data: ', error))
```

当我们开始执行构建时，`polyfills.bundle.js` 文件将会被载入到浏览器中，然后所有代码将正确无误的在浏览器中执行。请注意，以上的这些设定可能还会有所改进，我们只是对于如何解决「将 polyfills 提供给那些需要引入它的用户」这个问题，向你提供一个很棒的想法。

## 深度优化

`babel-preset-env` package 使用 [browserslist](https://github.com/browserslist/browserslist) 来转译那些你浏览器中不支持的特性。这里预设了 `useBuiltIns`选项，默认值是 `false`，能将你的全局 `babel-polyfill` 导入方式，改进为更细粒度的 `import` 格式：

```
import 'core-js/modules/es7.string.pad-start';
import 'core-js/modules/es7.string.pad-end';
import 'core-js/modules/web.timers';
import 'core-js/modules/web.immediate';
import 'core-js/modules/web.dom.iterable';
```

查看[仓库](https://github.com/babel/babel-preset-env)以获取更多信息。

## Node 内置

像 `process` 这种 Node 内置模块，能直接根据配置文件(configuration file)进行正确的 polyfills，且不需要任何特定的 loaders 或者 plugins。查看 [node 配置页面](https://www.webpackjs.com/configuration/node)获取更多信息。

## 其他工具

还有一些其他的工具能够帮助我们处理这些老旧的模块。

[`script-loader`](https://www.webpackjs.com/loaders/script-loader/) 会在全局上下文中对代码进行取值，类似于通过一个 `script` 标签引入脚本。在这种模式下，每一个标准的库(library)都应该能正常运行。`require`, `module` 等的取值是 undefined。

> 当使用 `script-loader` 时，模块将转化为字符串，然后添加到 bundle 中。它不会被 `webpack` 压缩，所以你应该选择一个 min 版本。同时，使用此 loader 将不会有 `devtool` 的支持。

这些老旧的模块如果没有 AMD/CommonJS 规范版本，但你也想将他们加入 `dist` 文件，你可以使用 [`noParse`](https://www.webpackjs.com/configuration/module/#module-noparse)来标识出这个模块。这样就能使 webpack 将引入这些模块，但是不进行转化(parse)，以及不解析(resolve) `require()` 和 `import` 语句。这个实践将提升构建性能。

> 例如 `ProvidePlugin`，任何需要 AST 的功能，都无法正常运行。

最后，有一些模块支持不同的[模块格式](https://www.webpackjs.com/concepts/modules)，比如 AMD 规范、CommonJS 规范和遗留模块(legacy)。在大多数情况下，他们首先检查`define`，然后使用一些古怪的代码来导出一些属性。在这些情况下，可以通过[`imports-loader`](https://www.webpackjs.com/loaders/imports-loader/)设置 `define=>false` 来强制 CommonJS 路径。

------

> 译者注：shim 是一个库(library)，它将一个新的 API 引入到一个旧的环境中，而且仅靠旧的环境中已有的手段实现。polyfill 就是一个用在浏览器 API 上的 shim。我们通常的做法是先检查当前浏览器是否支持某个 API，如果不支持的话就加载对应的 polyfill。然后新旧浏览器就都可以使用这个 API 了。