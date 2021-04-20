// Write a function that searches the prototype chain of an object for a given
// property and assigns it a new value. If the property does not exist in any of
// the prototype objects, the function should do nothing. The following code
// should work as shown:

let fooA = { bar: 1 };
let fooB = Object.create(fooA);
let fooC = Object.create(fooB);

assignProperty(fooC, "bar", 2);
console.log(fooA.bar); // 2
console.log(fooC.bar); // 2

assignProperty(fooC, "qux", 3);
console.log(fooA.qux); // undefined
console.log(fooC.qux); // undefined
console.log(fooA.hasOwnProperty("qux")); // false
console.log(fooC.hasOwnProperty("qux")); // false

//iterative solution
function assignProperty(obj, prop, val) {
  //while the final obj prototype isn't null
  while (obj !== null) {
    // check if obj prototype has own property of prop
    if (obj.hasOwnProperty(prop)) {
      // if so, assign value of val
      obj[prop] = val;
      break;
    }

    // re assign obj to its prototype
    obj = Object.getPrototypeOf(obj);
  }
}

// using recursion
function assignProperty(obj, prop, val) {
  if (obj === null) return;
  else if (obj.hasOwnProperty(prop)) obj[prop] = val;
  else assignProperty(Object.getPrototypeOf(obj), prop, val);
}