export function createElementDiv () {
  let ele = document.createElement('div')
  ele.textContent = 'webpack-dev-server支持热更新，而不用配置什么'
  return ele
}