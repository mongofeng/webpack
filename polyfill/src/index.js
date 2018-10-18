// import { resolve } from "upath";
console.log(2)
 fetch('https://jsonplaceholder.typicode.com/users')
   .then(function(response){
     console.log(response)
     console.log(typeof response)
     return response.json()
   })
   .then(function(json) {
     console.log('We retrieved some data! AND we\'re confident it will work on a variety of browser distributions.')
     console.log(json)

     let arr = json.map(function(item){
       return item.name
     } )

     let div = document.createElement('div')
     div.innerHTML = arr.join(",")

     document.body.appendChild(div);
   })
   .catch(function(error){
    console.error('Something went wrong when fetching this data: ', error)
   } )
