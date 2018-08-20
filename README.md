# webpack入门

## webpack的基础

### 为什要使用webpack

> 现今的很多网页其实可以看做是功能丰富的应用，它们拥有着复杂的JavaScript代码和一大堆依赖包。为了简化开发的复杂度，前端社区涌现出了很多好的实践方法
>
> 模块化，让我们可以把复杂的程序细化为小的文件; 
>
> 类似于TypeScript这种在JavaScript基础上拓展的开发语言：使我们能够实现目前版本的JavaScript不能直接使用的特性，并且之后还能转换为JavaScript文件使浏览器可以识别； 
> Scss，less等CSS预处理器 
> 
> 这些改进确实大大的提高了我们的开发效率，但是利用它们开发的文件往往需要进行额外的处理才能让浏览器识别,而手动处理又是非常繁琐的，这就为webpack类的工具的出现提供了需求。

### 什么是webpack

> webpack可以看做是模块打包机：它做的事情是，分析你的项目结构，找到JavaScript模块以及其它的一些浏览器不能直接运行的拓展语言（Scss，TypeScript等），并将其转换和打包为合适的格式供浏览器使用

### webpack的工作方式

> 把你的项目当做一个整体，通过一个给定的主文件（如：index.js），Webpack将从这个文件开始找到你的项目的所有依赖文件，使用loaders处理它们，最后打包为一个（或多个）浏览器可识别的JavaScript文件

### webpack的四大核心

- 入口(entry)
- 输出(output)
- loader
- 插件(plugins)



## 开始使用Webpack

### 安装webpack

- 初始化项目`npm init -y`
- 安装相应的依赖`webpack`

```
//全局安装
npm install -g webpack

//安装到你的项目目录
npm install --save-dev webpack

// 安装特定的版本
npm install --save-dev webpack@<version>

// 如果你使用 webpack 4+ 版本，你还需要安装 CLI。
npm install --save-dev webpack-cli
```

### 正式使用webpack

**通过命令行使用webpack**

webpack可以在终端中使用，在基本的使用方法如下：

```
{extry file} 出填写入口文件的路径，
{destination for bundled file}处 填写打包文件的存放路径
填写路径的时候不用添加{}
webpack {entry file} {destination for bundled file}
```

指定入口文件后，webpack将自动识别项目所依赖的其它文件，不过需要注意的是如果你的webpack不是全局安装的，那么当你在终端中使用此命令时，需要额外指定其在node_modules中的地址，继续上面的例子，在终端中输入如下命令

```
node_modules/.bin/webpack app/main.js public/bundle.js
```



**通过配置文件来使用Webpack**

Webpack拥有很多其它的比较高级的功能（比如说本文后面会介绍的loaders和plugins），这些功能其实都可以通过命令行模式实现，但是正如前面提到的，这样不太方便且容易出错的，更好的办法是定义一个配置文件，这个配置文件其实也是一个简单的JavaScript模块，我们可以把所有的与打包相关的信息放在里面

在当前练习文件夹的根目录下新建一个名为webpack.config.js的文件，我们在其中写入如下所示的简单配置代码，目前的配置主要涉及到的内容是入口文件路径和打包后文件的存放路径。

```
module.exports = {
  entry:  __dirname + "/src/main.js",//已多次提及的唯一入口文件
  output: {
    path: __dirname + "/dist",//打包后的文件存放的地方
    filename: "app.js"//打包后输出文件的文件名
  }
}


注：“__dirname”是node.js中的一个全局变量，它指向当前执行脚本所在的目录。
```

```
module.exports = {
  // entry: __dirname + '/src/main.js',
  entry: {
    app: __dirname + '/src/main.js',
    element: __dirname + '/src/element.js'
  },

  output: {
    path: __dirname +  '/dist', // 打包后存放的文件夹
    // filename: 'app.js' // 打包后的文件
    filename: '[name].app.js' // 打包后的文件
  }
}
```

有了这个配置之后，再打包文件，只需在终端里运行webpack(非全局安装需使用node_modules/.bin/webpack)命令就可以了，这条命令会自动引用webpack.config.js文件中的配置选项

> 如果 `webpack.config.js` 存在，则 `webpack` 命令将默认选择使用它。我们在这里使用 `--config` 选项只是向你表明，可以传递任何名称的配置文件。这对于需要拆分成多个文件的复杂配置是非常有用。



**更快捷的执行打包任务**

在命令行中输入命令需要代码类似于node_modules/.bin/webpack这样的路径其实是比较烦人的，不过值得庆幸的是npm可以引导任务执行，对npm进行配置后可以在命令行中使用简单的npm start命令来替代上面略微繁琐的命令。在package.json中对scripts对象进行相关设置即可，设置方法如下。

```
{
  "name": "webpack",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "start": "webpack" // 修改的是这里，JSON文件不支持注释，引用时请清除
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "webpack": "^4.16.5",
    "webpack-cli": "^3.1.0"
  }
}
```

```
注：package.json中的script会安装一定顺序寻找命令对应位置，本地的node_modules/.bin路径就在这个寻找清单中，所以无论是全局还是局部安装的Webpack，你都不需要写前面那指明详细的路径了。
```

npm的start命令是一个特殊的脚本名称，其特殊性表现在，在命令行中使用npm start就可以执行其对于的命令，如果对应的此脚本名称不是start，想要在命令行中运行时，需要这样用npm run {script name}如npm run build

现在只需要使用npm start就可以打包文件了



**loader的配置**

webpack 最出色的功能之一就是，除了 JavaScript，还可以通过 loader *引入任何其他类型的文件*。也就是说，以上列出的那些 JavaScript 的优点（例如显式依赖），同样可以用来构建网站或 web 应用程序中的所有非 JavaScript 内容。

```
npm install --save-dev style-loader css-loader
```

```
module.exports = {
  mode: 'production',
  devtool: 'eval-source-map',
  entry: __dirname + '/src/main.js',

  output: {
    path: __dirname +  '/dist', // 打包后存放的文件夹
    filename: 'app.js' // 打包后的文件
  },

  module: {
    rules: [{
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader'
      ]
    }]
  }
}
```

> webpack 根据正则表达式，来确定应该查找哪些文件，并将其提供给指定的 loader。在这种情况下，以 `.css` 结尾的全部文件，都将被提供给 `style-loader` 和 `css-loader`。



**插件(plugins)**

我们在 `index.html` 文件中手动引入所有资源，然而随着应用程序增长，手动地对 `index.html` 文件进行管理，一切就会变得困难起来。然而，可以通过一些插件，会使这个过程更容易操控

```
npm install --save-dev html-webpack-plugin
```

```
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  mode: 'production',
  devtool: 'eval-source-map',
  // entry: __dirname + '/src/main.js',
  entry: {
    app: __dirname + '/src/main.js',
    element: __dirname + '/src/element.js'
  },

  output: {
    path: __dirname +  '/dist', // 打包后存放的文件夹
    // filename: 'app.js' // 打包后的文件
    filename: '[name].app.js' // 打包后的文件
  },

  module: {
    rules: [{
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader'
      ]
    }]
  },

  plugins: [
    new HtmlWebpackPlugin({
      hash: true,
      template:  __dirname + '/src/index.html'
    })
  ]
}
```



## 参考文档

- [webpack中文网](https://www.webpackjs.com/)
- [webpack 入门，超详细](https://blog.csdn.net/bryblog/article/details/78060694)