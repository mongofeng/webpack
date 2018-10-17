import _ from 'loadsh'
// import {app} from './num'
// import math from './math'
function component() {
  var element = document.createElement("div");
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  // console.log(111)
  // console.log(app)
  // math()
  return element;
}

document.body.appendChild(component());
