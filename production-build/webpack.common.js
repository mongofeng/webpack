// https://www.webpackjs.com/guides/production/
 const path = require('path');
 const CleanWebpackPlugin = require('clean-webpack-plugin');
 const HtmlWebpackPlugin = require('html-webpack-plugin');
 console.log(process.env.NODE_ENV)

 module.exports = {
   entry: {
     app: path.resolve(__dirname, 'src/index.js')
   },
   plugins: [
     new CleanWebpackPlugin([path.resolve(__dirname, 'dist')]),
     new HtmlWebpackPlugin({
       title: 'Production'
     })
   ],
  output: {
    filename: '[name].bundle.js',
     path: path.resolve(__dirname, 'dist')
   }
 };