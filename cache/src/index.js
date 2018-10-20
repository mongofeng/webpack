import _ from 'lodash';
// import {app} from './num'
import math from './math'
function component() {
  var element = document.createElement("div");
  console.log(_)
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  // console.log(111)
  // console.log(app)
  math()
  return element;
}

document.body.appendChild(component());
