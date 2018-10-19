function greeter(person: string) {
  return "Hello, " + person;
}

let user = '11111'

class Greeter {
  greeting: string;
  constructor(message: string) {
      this.greeting = message;
  }
  greet() {
      return "Hello, " + this.greeting;
  }
}

let greeterPerson = new Greeter("world");

let str = `${greeter(user)}${greeterPerson.greet()}`

document.body.innerHTML = str