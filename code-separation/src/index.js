// import _ from 'lodash';

// console.log(
//   _.join(['Another', 'module', 'loaded!'], '#### ')
// );


 function getComponent() {
  // const _ = await import(/* webpackChunkName: "lodash" */ 'lodash');

   return import(/* webpackChunkName: "lodash" */ 'lodash').then(_ => {
        var element = document.createElement('div');

        element.innerHTML = _.join(['Hello', 'webpack'], ' ');

        return element;

      }).catch(error => 'An error occurred while loading the component');
    }
  

 getComponent().then(component => {
  document.body.appendChild(component);
  })