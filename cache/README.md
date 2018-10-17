- # 高速缓存

  [编辑文档](https://github.com/webpack/webpack.js.org/edit/master/src/content/guides/caching.md)

  > 本指南中的示例源于[入门](https://webpack.js.org/guides/getting-started)，[输出管理](https://webpack.js.org/guides/output-management)和[代码拆分](https://webpack.js.org/guides/code-splitting)。

  因此，我们使用webpack捆绑我们的模块化应用程序，从而生成可部署的`/dist`目录。一旦将内容`/dist`部署到服务器，客户端（通常是浏览器）将命中该服务器以获取站点及其资产。最后一步可能很耗时，这就是为什么浏览器使用一种称为[缓存](https://searchstorage.techtarget.com/definition/cache)的技术。这使得站点可以更快地加载，减少不必要的网络流量，但是当您需要拾取新代码时，它也会导致令人头疼的问题。

  本指南重点介绍确保webpack编译生成的文件可以保持缓存所需的配置，除非其内容已更改。

  ## 输出文件名 

  确保浏览器选择已更改文件的一种简单方法是使用`output.filename` [替换](https://webpack.js.org/configuration/output#output-filename)。该`[hash]`置换可用于文件名中包含特定生成散列，但它甚至更好使用`[contenthash]`替代这是一个文件的内容，这是每个资产不同的哈希值。

  让我们我们的项目设置使用从示例[入门](https://webpack.js.org/guides/getting-started)与`plugins`从[输出管理](https://webpack.js.org/guides/output-management)，所以我们没有处理好保持我们的`index.html`手动文件：

  **项目**

  ```
  webpack-demo
  |- package.json
  |- webpack.config.js
  |- /dist
  |- /src
    |- index.js
  |- /node_modules
  ```

  **webpack.config.js**

  ```
    const path = require('path');
    const CleanWebpackPlugin = require('clean-webpack-plugin');
    const HtmlWebpackPlugin = require('html-webpack-plugin');

    module.exports = {
      entry: './src/index.js',
      plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
  -       title: 'Output Management'
  +       title: 'Caching'
        })
      ],
      output: {
  -     filename: 'bundle.js',
  +     filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist')
      }
    };
  ```

  运行我们的构建脚本，`npm run build`使用此配置应生成以下输出：

  ```
  ...
                         Asset       Size  Chunks                    Chunk Names
  main.7e2c49a622975ebd9b7e.js     544 kB       0  [emitted]  [big]  main
                    index.html  197 bytes          [emitted]
  ...
  ```

  如您所见，捆绑包的名称现在反映其内容（通过哈希）。如果我们运行另一个构建而不做任何更改，我们希望文件名保持不变。但是，如果我们再次运行它，我们可能会发现情况并非如此：

  ```
  ...
                         Asset       Size  Chunks                    Chunk Names
  main.205199ab45963f6a62ec.js     544 kB       0  [emitted]  [big]  main
                    index.html  197 bytes          [emitted]
  ...
  ```

  这是因为webpack在条目块中包含某些样板，特别是运行时和清单。

  > 输出可能因您当前的Webpack版本而异。与某些旧版本相比，较新版本可能没有与散列相同的所有问题，但我们仍建议您采取以下步骤以确保安全。

  ## 提取锅炉板 

  正如我们在[代码拆分中](https://webpack.js.org/guides/code-splitting)所学到的，[`SplitChunksPlugin`](https://webpack.js.org/plugins/split-chunks-plugin/)可以使用它将模块拆分为单独的包。webpack提供了一个优化功能，它根据提供的选项将运行时代码拆分为单独的块，只需使用[`optimization.runtimeChunk`](https://webpack.js.org/configuration/optimization/#optimization-runtimechunk)set来`single`创建一个运行时包：

  **webpack.config.js**

  ```
    const path = require('path');
    const CleanWebpackPlugin = require('clean-webpack-plugin');
    const HtmlWebpackPlugin = require('html-webpack-plugin');

    module.exports = {
      entry: './src/index.js',
      plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
          title: 'Caching'
      ],
      output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist')
      },
  +   optimization: {
  +     runtimeChunk: 'single'
  +   }
    };
  ```

  让我们运行另一个构建来查看提取的`runtime`包：

  ```
  Hash: 82c9c385607b2150fab2
  Version: webpack 4.12.0
  Time: 3027ms
                            Asset       Size  Chunks             Chunk Names
  runtime.cc17ae2a94ec771e9221.js   1.42 KiB       0  [emitted]  runtime
     main.e81de2cf758ada72f306.js   69.5 KiB       1  [emitted]  main
                       index.html  275 bytes          [emitted]
  [1] (webpack)/buildin/module.js 497 bytes {1} [built]
  [2] (webpack)/buildin/global.js 489 bytes {1} [built]
  [3] ./src/index.js 309 bytes {1} [built]
      + 1 hidden module
  ```

  将第三方库（例如`lodash`或）提取`react`到单独的`vendor`块中也是一种很好的做法，因为它们比我们的本地源代码更不可能更改。此步骤将允许客户端从服务器请求更少，以保持最新。这可以通过使用[SplitChunksPlugin的示例2中](https://webpack.js.org/plugins/split-chunks-plugin/#split-chunks-example-2)演示的[`cacheGroups`](https://webpack.js.org/plugins/split-chunks-plugin/#splitchunks-cachegroups)选项来完成。让我们来添加与旁边PARAMS和构建：[`SplitChunksPlugin`](https://webpack.js.org/plugins/split-chunks-plugin/)`optimization.splitChunks``cacheGroups`

  **webpack.config.js**

  ```
    var path = require('path');
    const CleanWebpackPlugin = require('clean-webpack-plugin');
    const HtmlWebpackPlugin = require('html-webpack-plugin');

    module.exports = {
      entry: './src/index.js',
      plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
          title: 'Caching'
        }),
      ],
      output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist')
      },
      optimization: {
  -     runtimeChunk: 'single'
  +     runtimeChunk: 'single',
  +     splitChunks: {
  +       cacheGroups: {
  +         vendor: {
  +           test: /[\\/]node_modules[\\/]/,
  +           name: 'vendors',
  +           chunks: 'all'
  +         }
  +       }
  +     }
      }
    };
  ```

  让我们运行另一个构建来查看我们的新`vendor`包：

  ```
  ...
                            Asset       Size  Chunks             Chunk Names
  runtime.cc17ae2a94ec771e9221.js   1.42 KiB       0  [emitted]  runtime
  vendors.a42c3ca0d742766d7a28.js   69.4 KiB       1  [emitted]  vendors
     main.abf44fedb7d11d4312d7.js  240 bytes       2  [emitted]  main
                       index.html  353 bytes          [emitted]
  ...
  ```

  我们现在可以看到我们的`main`包不包含目录中的`vendor`代码，`node_modules`并且大小不足`240 bytes`！

  ## 模块标识符 

  让我们`print.js`为我们的项目添加另一个模块：

  **项目**

  ```
  webpack-demo
  |- package.json
  |- webpack.config.js
  |- /dist
  |- /src
    |- index.js
  + |- print.js
  |- /node_modules
  ```

  **print.js**

  ```
  + export default function print(text) {
  +   console.log(text);
  + };
  ```

  **SRC / index.js**

  ```
    import _ from 'lodash';
  + import Print from './print';

    function component() {
      var element = document.createElement('div');

      // Lodash, now imported by this script
      element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  +   element.onclick = Print.bind(null, 'Hello webpack!');

      return element;
    }

    document.body.appendChild(component());
  ```

  运行另一个构建，我们只希望我们的`main`bundle的哈希值会改变，但是......

  ```
  ...
                             Asset       Size  Chunks                    Chunk Names
    vendor.a7561fb0e9a071baadb9.js     541 kB       0  [emitted]  [big]  vendor
      main.b746e3eb72875af2caa9.js    1.22 kB       1  [emitted]         main
  manifest.1400d5af64fc1b7b3a45.js    5.85 kB       2  [emitted]         manifest
                        index.html  352 bytes          [emitted]
  ...
  ```

  ......我们可以看到三者都有。这是因为[`module.id`](https://webpack.js.org/api/module-variables#module-id-commonjs-)默认情况下每个都根据解析顺序递增。更改解析顺序时的含义，ID也会更改。所以，回顾一下：

  - `main`捆绑包因其新内容而发生变化。
  - 该`vendor`包更改，因为它`module.id`改变了。
  - 而且，`manifest`捆绑包已更改，因为它现在包含对新模块的引用。

  第一个和最后一个是预期的 - 这是`vendor`我们想要解决的哈希值。幸运的是，我们可以使用两个插件来解决此问题。第一个是`NamedModulesPlugin`，它将使用模块的路径而不是数字标识符。虽然此插件在开发期间对于更易读的输出非常有用，但运行起来需要更长的时间。第二个选项是[`HashedModuleIdsPlugin`](https://webpack.js.org/plugins/hashed-module-ids-plugin)，建议用于生产构建：

  **webpack.config.js**

  ```
    const path = require('path');
  + const webpack = require('webpack');
    const CleanWebpackPlugin = require('clean-webpack-plugin');
    const HtmlWebpackPlugin = require('html-webpack-plugin');

    module.exports = {
      entry: './src/index.js',
      plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
          title: 'Caching'
        }),
  +      new webpack.HashedModuleIdsPlugin()
      ],
      output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist')
      },
      optimization: {
        runtimeChunk: 'single',
        splitChunks: {
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all'
            }
          }
        }
      }
    };
  ```

  现在，尽管有任何新的本地依赖项，我们的`vendor`哈希应该在构建之间保持一致：

  ```
  ...
                            Asset       Size  Chunks             Chunk Names
     main.216e852f60c8829c2289.js  340 bytes       0  [emitted]  main
  vendors.55e79e5927a639d21a1b.js   69.5 KiB       1  [emitted]  vendors
  runtime.725a1a51ede5ae0cfde0.js   1.42 KiB       2  [emitted]  runtime
                       index.html  353 bytes          [emitted]
  Entrypoint main = runtime.725a1a51ede5ae0cfde0.js vendors.55e79e5927a639d21a1b.js main.216e852f60c8829c2289.js
  ...
  ```

  让我们修改我们`src/index.js`暂时删除那个额外的依赖：

  **SRC / index.js**

  ```
    import _ from 'lodash';
  - import Print from './print';
  + // import Print from './print';

    function component() {
      var element = document.createElement('div');

      // Lodash, now imported by this script
      element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  -   element.onclick = Print.bind(null, 'Hello webpack!');
  +   // element.onclick = Print.bind(null, 'Hello webpack!');

      return element;
    }

    document.body.appendChild(component());
  ```

  最后再次运行我们的构建：

  ```
  ...
                            Asset       Size  Chunks             Chunk Names
     main.ad717f2466ce655fff5c.js  274 bytes       0  [emitted]  main
  vendors.55e79e5927a639d21a1b.js   69.5 KiB       1  [emitted]  vendors
  runtime.725a1a51ede5ae0cfde0.js   1.42 KiB       2  [emitted]  runtime
                       index.html  353 bytes          [emitted]
  Entrypoint main = runtime.725a1a51ede5ae0cfde0.js vendors.55e79e5927a639d21a1b.js main.ad717f2466ce655fff5c.js
  ...
  ```

  我们可以看到两个版本都`55e79e5927a639d21a1b`在`vendor`bundle的文件名中产生。

  ## 结论 

  缓存变得混乱。干净利落。但是，上面的演练应该为您提供部署一致，可缓存资产的运行开始。请参阅下面的*进一步阅读*部分以了解更多信息