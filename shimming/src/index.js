// import { file, parse } from './globals.js';
function component() {
  var element = document.createElement("div");

  // element.innerHTML = _.join(["Hello", "webpack"], " ");

  // let arr = []
  console.log(333)
  this.alert('Hmmm, this probably isn\'t a great idea...')

  // element.innerHTML = join(['Hello', 'webpack'], ' ');
  // parse()
  // console.log(file)

  return element;
}

document.body.appendChild(component());
