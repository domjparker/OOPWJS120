let RECTANGLE = {
  area: function() {
    return this.width * this.height;
  },
  perimeter: function() {
    return 2 * (this.width + this.height);
  }
};

function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  this.area = RECTANGLE.area.call(this);
  this.perimeter = RECTANGLE.perimeter.call(this);
}

let rect1 = new Rectangle(2, 3);
console.log(rect1.area);      // => 6
console.log(rect1.perimeter); // => 10

// ------------------------------

const Circle = function(radius) {
  this.radius = radius;
};

Circle.prototype.area = function() {
  return Math.PI * this.radius * this.radius;
};

let a = new Circle(3);
let b = new Circle(4);

a.area().toFixed(2); // => 28.27
b.area().toFixed(2); // => 50.27
a.hasOwnProperty('area'); // => false

// ------------------------------

function Ninja() {
  this.swung = true;
}

let ninja = new Ninja();

Ninja.prototype.swingSword = function() {
  return this.swung;
};

console.log(ninja.swingSword()); // logs true

// ------------------------------

function Ninja() {
  this.swung = true;
}

let ninja = new Ninja();

Ninja.prototype = {
  swingSword: function() {
    return this.swung;
  },
};

console.log(ninja.swingSword()); // Uncaught TypeError: ninja.swingSword is not a function

// The prototype for the ninja object doesn't change; it's still the 
// original prototype defined during the constructor's invocation. Thus, 
// JavaScript can't find the swingSword method in the prototype chain of ninja.

// ------------------------------

function Ninja() {
  this.swung = false;
}

Ninja.prototype.swing = function() {
    this.swung = true;
    return this;
}

let ninjaA = new Ninja();
let ninjaB = new Ninja();

console.log(ninjaA.swing().swung);      // logs `true`
console.log(ninjaB.swing().swung);      // logs `true`

//pattern of "chainable" methods invocations and property accesses
// on an object requires that methods defined on the prototype always
// return the context object (in this case, ninjaA and ninjaB).

// ------------------------------

// create a new instance of an object, without having direct access to the constructor function

let ninjaA;

{
  const Ninja = function() {
    this.swung = false;
  };

  ninjaA = new Ninja();
}

let ninjaB = new ninjaA.constructor();

ninjaA.constructor === ninjaB.constructor // => true

// ------------------------------

//Since a constructor is just a function, you can call it without the new operator. However, that can lead to unexpected results and errors, especially for inexperienced programmers. Write a constructor function that you can use with or without the new operator. The function should return the same result with either form. Use the code below to check your solution:

function User(first, last) {
  if (this instanceof User) {
      this.name = `${first} ${last}`;
  } else {
      return new User(first, last);
  }
}

let name = 'Jane Doe';
let user1 = new User('John', 'Doe');
let user2 = User('John', 'Doe');

console.log(name);         // => Jane Doe
console.log(user1.name);   // => John Doe
console.log(user2.name);   // => John Doe

// Constructor functions built this way are called scope-safe constructors. Most, but not all, of JavaScript's built-in constructors, such as Object, RegExp, and Array, are scope-safe. String is not:

// new Object();          // Object {}
// Object();              // Object {}

// new Array(1, 2, 3);    // [1, 2, 3]
// Array(1, 2, 3);        // [1, 2, 3]

// new String("abc");     // [String: 'abc']
// String("abc");         // 'abc'

// ------------------------------

