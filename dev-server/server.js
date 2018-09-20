const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('./webpack.config');


// const devServerOptions = Object.assign({}, webpackConfig.devServer, {
//   stats: {
//     colors: true
//   }
// });
console.log(webpackConfig.devServer)

// 去除server的配置
const devServerOptions = {
  contentBase: './dist',
  hot: true,
  host: 'localhost'
};

WebpackDevServer.addDevServerEntrypoints(webpackConfig, devServerOptions);


const compiler = Webpack(webpackConfig);
const server = new WebpackDevServer(compiler, devServerOptions);

server.listen(9090, '127.0.0.1', () => {
  console.log('Starting server on http://localhost:9090');
});