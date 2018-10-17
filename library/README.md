# 创作图书馆

[编辑文档](https://github.com/webpack/webpack.js.org/edit/master/src/content/guides/author-libraries.md)

除了应用程序，webpack还可用于捆绑JavaScript库。以下指南适用于希望简化捆绑策略的图书馆作者。

## 创作图书馆 

让我们假设您正在编写一个小型库，`webpack-numbers`允许用户将数字1到5从数字表示转换为文本表示，反之亦然，例如2到'2'。

基本项目结构可能如下所示：

**项目**

```
+  |- webpack.config.js
+  |- package.json
+  |- /src
+    |- index.js
+    |- ref.json
```

初始化npm，安装webpack和lodash：

```
npm init -y
npm install --save-dev webpack lodash
```

**SRC / ref.json**

```
[
  {
    "num": 1,
    "word": "One"
  },
  {
    "num": 2,
    "word": "Two"
  },
  {
    "num": 3,
    "word": "Three"
  },
  {
    "num": 4,
    "word": "Four"
  },
  {
    "num": 5,
    "word": "Five"
  },
  {
    "num": 0,
    "word": "Zero"
  }
]
```

**SRC / index.js**

```
import _ from 'lodash';
import numRef from './ref.json';

export function numToWord(num) {
  return _.reduce(numRef, (accum, ref) => {
    return ref.num === num ? ref.word : accum;
  }, '');
}

export function wordToNum(word) {
  return _.reduce(numRef, (accum, ref) => {
    return ref.word === word && word.toLowerCase() ? ref.num : accum;
  }, -1);
}
```

库使用的使用规范如下：

- **ES2015模块导入：**

```
import * as webpackNumbers from 'webpack-numbers';
// ...
webpackNumbers.wordToNum('Two');
```

- **CommonJS模块需要：**

```
var webpackNumbers = require('webpack-numbers');
// ...
webpackNumbers.wordToNum('Two');
```

- **AMD模块要求：**

```
require(['webpackNumbers'], function ( webpackNumbers) {
  // ...
  webpackNumbers.wordToNum('Two');
});
```

消费者也可以通过脚本标记加载库来使用它：

```
<!doctype html>
<html>
  ...
  <script src="https://unpkg.com/webpack-numbers"></script>
  <script>
    // ...
    // Global variable
    webpackNumbers.wordToNum('Five')
    // Property in the window object
    window.webpackNumbers.wordToNum('Five')
    // ...
  </script>
</html>
```

请注意，我们还可以通过以下方式将其配置为公开库：

- 全局对象中的属性，用于节点。
- `this`对象中的属性。

有关完整的库配置和代码，请参阅[webpack-library-example](https://github.com/kalcifer/webpack-library-example)。

## 基本配置 

现在让我们以一种实现以下目标的方式捆绑这个库：

- 没有捆绑`lodash`，但要求消费者使用它来加载`externals`。
- 将库名设置为`webpack-numbers`。
- 将库公开为名为的变量`webpackNumbers`。
- 能够访问Node.js中的库。

此外，消费者应该能够通过以下方式访问库：

- ES2015模块。即`import webpackNumbers from 'webpack-numbers'`。
- CommonJS模块。即`require('webpack-numbers')`。
- 通过`script`标记包含的全局变量。

我们可以从这个基本的webpack配置开始：

**webpack.config.js**

```
var path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'webpack-numbers.js'
  }
};
```

## 外部化Lodash 

现在，如果你运行`webpack`，你会发现创建了一个较大的包。如果您检查该文件，您将看到lodash已与您的代码捆绑在一起。在这种情况下，我们宁愿把它`lodash`视为一种`peerDependency`。意味着消费者应该已经`lodash`安装。因此，您可能希望将此外部库的控制权放弃到库的使用者。

这可以使用`externals`配置完成：

**webpack.config.js**

```
  var path = require('path');

  module.exports = {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'webpack-numbers.js'
-   }
+   },
+   externals: {
+     lodash: {
+       commonjs: 'lodash',
+       commonjs2: 'lodash',
+       amd: 'lodash',
+       root: '_'
+     }
+   }
  };
```

这意味着您的库需要一个名为的依赖项`lodash`在消费者环境中可用。

> 请注意，如果您只打算将库用作另一个webpack包中的依赖项，则可以指定`externals`为数组。

## 外部限制 

对于使用依赖项中的多个文件的库：

```
import A from 'library/one';
import B from 'library/two';

// ...
```

通过`library`在外部指定，您将无法从捆绑中排除它们。您需要逐个排除它们或使用正则表达式。

```
module.exports = {
  //...
  externals: [
    'library/one',
    'library/two',
    // Everything that starts with "library/"
    /^library\/.+$/
  ]
};
```

## 公开图书馆 

对于库的广泛使用，我们希望它在不同的环境中兼容，即CommonJS，AMD，Node.js和全局变量。要使您的库可供使用，请在其中添加`library`属性`output`：

**webpack.config.js**

```
  var path = require('path');

  module.exports = {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
-     filename: 'webpack-numbers.js'
+     filename: 'webpack-numbers.js',
+     library: 'webpackNumbers'
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
```

> 请注意，`library`设置与`entry`配置相关联。对于大多数库，指定单个入口点就足够了。虽然可以使用[多部分库](https://github.com/webpack/webpack/tree/master/examples/multi-part-library)，但通过作为单个入口点的[索引脚本](https://stackoverflow.com/questions/34072598/es6-exporting-importing-in-index-file)公开部分导出更为简单。使用`array`作为一个`entry`为库点**不推荐**。

这会将您的库捆绑包公开为`webpackNumbers`导入时命名的全局变量。要使库与其他环境兼容，请将`libraryTarget`属性添加到配置中。这将添加有关如何公开库的不同选项。

**webpack.config.js**

```
  var path = require('path');

  module.exports = {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'webpack-numbers.js',
-     library: 'webpackNumbers'
+     library: 'webpackNumbers',
+     libraryTarget: 'umd'
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
```

您可以通过以下方式公开库：

- 变量：作为`script`tag（`libraryTarget:'var'`）提供的全局变量。
- 这个：通过`this`object（`libraryTarget:'this'`）获得。
- 窗口：`window`在浏览器（`libraryTarget:'window'`）中通过对象可用。
- UMD：在AMD或CommonJS `require`（`libraryTarget:'umd'`）之后可用。

如果`library`已设置`libraryTarget`且未设置，则`libraryTarget`默认`var`为[输出配置文档中](https://webpack.js.org/configuration/output)指定的值。见[`output.libraryTarget`](https://webpack.js.org/configuration/output#output-librarytarget)那里的所有可用选项的详细列表。

> 使用webpack 3.5.5时，使用`libraryTarget: { root:'_' }`不正常（如[问题4824中所述](https://github.com/webpack/webpack/issues/4824)）。但是，您可以将`libraryTarget: { var: '_' }`库设置为全局变量。

### 最后的步骤 

按照[生产指南中](https://webpack.js.org/guides/production)的步骤优化生产输出。我们还将我们生成的包的路径添加为包的`main`字段`package.json`

**的package.json**

```
{
  ...
  "main": "dist/webpack-numbers.js",
  ...
}
```

或者，按照[本指南](https://github.com/dherman/defense-of-dot-js/blob/master/proposal.md#typical-usage)添加标准模块：

```
{
  ...
  "module": "src/index.js",
  ...
}
```

关键`main`是指[从标准`package.json`](https://docs.npmjs.com/files/package.json#main)，并`module`以[一个](https://github.com/dherman/defense-of-dot-js/blob/master/proposal.md) [建议](https://github.com/rollup/rollup/wiki/pkg.module)，让JavaScript的生态系统升级到使用ES2015模块，而不破坏向后兼容性。

> 该`module`属性应指向使用ES2015模块语法但没有浏览器或节点尚不支持的其他语法功能的脚本。这使得webpack能够解析模块语法本身，如果用户只使用了库的某些部分，则可以通过[树摇动](https://webpack.js.org/guides/tree-shaking/)实现更轻的捆绑。

现在，您可以[将其作为npm包发布，](https://docs.npmjs.com/getting-started/publishing-npm-packages)并在[unpkg.com](https://unpkg.com/#/)上找到它以将其分发给您的用户。

> 要公开与库关联的样式表，[`ExtractTextPlugin`](https://webpack.js.org/plugins/extract-text-webpack-plugin)应使用它。然后，用户可以像使用任何其他样式表一样使用和加载这些内容。