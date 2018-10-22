// let name = 'test'
// let module = require("./resource/" + name + ".js");
// console.log(module)

// 自定义上下文
console.log(require)
let result = {}
let context = require.context("./resource", false, /\.test\.js$/);
const keys = context.keys();
console.log(context.id)

keys.forEach(element => {
  result[element] = context(element)
  result[element].path = context.resolve(element)
  console.log(context.resolve(element)) // 实际的路径
});

console.log(result)