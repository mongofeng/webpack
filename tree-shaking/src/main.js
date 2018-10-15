import {squ} from './math'
console.log(squ)
let root = document.querySelector('#root')

root.innerHTML = [
   'Hello webpack!',
    '5 cubed is equal to ' + squ(5)
].join('\n\n');
