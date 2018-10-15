let root = document.createElement('div')

console.log(process.env)
console.log(process.env.NODE_ENV)
 if (process.env.NODE_ENV !== 'production') {
   console.log('Looks like we are in development mode!');
 }

root.innerHTML = [
   'Hello webpack!',
    '5 cubed is equal to '
].join('\n\n');

document.documentElement.appendChild(root)