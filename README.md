# nanoscript (nscript)

## current version 0.0.1

# This is a Work in Progress (not functional yet)

## Purpose
nanoscript (nscript) is a lightweight, JavaScript-inspired programming language designed for simple computational tasks in the browser or on the server. Built with TypeScript, it draws inspiration from an earlier C++-based project, clx, and is tailored to address security concerns that arise with JavaScript's `eval`. nscript ensures safe execution of code by limiting access to only explicitly included features through developer-defined modules.

nanoscript operates on a lightweight engine that runs seamlessly in both browser and server environments. Built with TypeScript, nscript code can be executed anywhere JavaScript is supported. While the engine executes code using JavaScript, nanoscript is inherently slower than running equivalent algorithms directly in JavaScript. However, its focus is not on speed but on providing a secure and flexible environment. A typical use case for nanoscript is enabling power-users to write custom logic or advanced configurations to interact with an application safely. Executing external code on a server using `eval` or similar methods can expose the application to significant security risks, as `eval` enables the execution of fully-featured JavaScript, potentially allowing malicious actions.

Javascript functions and objects can be passed into the engine and called by name to allow integration with your application code.  Nanoscript is a convenient way to write code that glues together your more performant application code


## Key Features

- **JavaScript-inspired Syntax**: Familiar syntax for JavaScript developers.
- **Secure Execution**: No access to features outside explicitly defined modules.
- **High-Level Constructs**: Includes variables, loops, functions, and more.
- **Customizable Modules**: Extendable via developer-defined modules for specific use cases.
- **Advanced Loop Control**: Nested loop control with `break x;`.
- **String Interpolation**: Template strings with syntax: `hello ${world}`.
- **Upcoming Features**: Class declarations


## Table of Contents

1. [Installation](#installation)
2. [Usage](#usage)
3. [Nanoscript Syntax Overview](#nanoscript-syntax-overview)
4. [Future Features](#future-features)
5. [Examples](#examples)
6. [License](#license)

---

## Installation

Install using NPM

```npm install @creation-wasteland/nanoscript```

## Usage

Import NSEngine from the module

```typescript
// typescript

import { NSEngine } from "@creation-wasteland/nanoscript";
```

Add any required modules so that your API can be called from the engine.

To create a nenv module, define a new nenv.NenvModule with a ```name``` and ```exports```

The ```exports``` property should contain a list of NenvExports. Each export needs to have a ```name```, ```type```, and ```object```.

```typescript
// typescript

const myModule = {
    name: "myModule",
    exports: [
        { name: "myObject", type: "constant", object: {x: 1, y: 2, z: 3} },
        { name: "myFunction", type: "function", object: (a: number, b: number) => a + b },
        ...
    ] as nenv.NenvExport[]
} as nenv.NenvModule;
```

To add your module to the engine, use the ```addModules``` method


```typescript
// typescript

const engine = new NSEngine();
engine.addModules([
    myModule,
    ...
])
```

To compile and execute nanoscript code, use the ```compileAndRun``` method


```typescript
// typescript

const output = engine.compileAndRun(code);
```




## Nanoscript Syntax Overview

Nanoscript is a language that is similar to the most basic elements of javascript/c with some slight syntax modifications. If you are used to javascript, you should instantly be able to use nanoscript.



### Variable and const declarations
Variable declarations are similar to javascript. Let and const both have block scoping (similar to how it would work in C)


```javascript
// nanoscript

let x = 0;
const y = 'hello';
```

*In the future, a strict typing system will be added so that variables can be declared with their datatype*

### For and while loops
```javascript
// nanoscript

for (let i = 0; i < 100; i++) {
    ...
}

let c = 10;
while (c >= 0) {
    ...
}
```

One notable "new" feature, is the ability to break directly to different levels.

### For and while loops
```javascript
// nanoscript

for (let i = 0; i < 100; i++) {
    for (let j = 0; j < 100; j++) {
        if (i + j == 50) {
            break 2; // break out of the enclosing loop
        }
    }
}
```


### Strings

You can use `"`, `'`, or ``` ` ``` to denote string literals
```javascript
// nanoscript

let s1 = "Hello";
let s2 = 'Hello';
let s3 = `Hello`;

```

### String Builder Strings (Template Strings, Formatted Strings, whatever you want to call it...)

There is support for string templating using the  ``` ` ``` character.
Template elements must be surrounded by ```${}```
```javascript
// nanoscript

let s1 = "World";
let s2 = `Hello ${s1}`;     // Hello World

```

### Internal Functions

Functions can be defined using the ```function``` keyword. Functions can then be called by name while in scope.
```javascript
// nanoscript

function func(a, b) {
    return a + b;
}

func(1,2);      // 3
 
```
*Currently, functions are not designed to easily be used as first class objects. Still working on this.*

### List Literals

Lists can be declared with list literal syntax, similar to javascript
```javascript
let arr = [0,1,2,3,4,5];    // js list with 6 elements
let arr2 = [];              // empty list

```

*Lists are constructed at script runtime, further optimizations will be added to allow for the creation of  compile-time lists to improve performance when possible.*

### Object Literals

Objects can be created with a familiar syntax as well. 

*Note: Object keys must be enclosed with single or double quotes like strings.*
```javascript
let o = {
    'x': 1.0,
    'y': 2.5
};

let dog = {
    'name': 'Dogmeat',
    'level': 42
};

```

*Objects are constructed at script runtime, further optimizations will be added to allow for the creation of  compile-time objects to improve performance when possible.*



## Examples

```typescript
// typescript

const code = ... // Your nanoscript code (below)

const myModule = {
    name: "myModule",
    exports: [
        { name: "addNumbers", type: "function", object: (a: number, b: number) => a + b },
        ...
    ] as nenv.NenvExport[]
} as nenv.NenvModule;

const engine = new NSEngine();
engine.addModules([
    myModule,
    ...
]);

const output = engine.compileAndRun(code);


```

```javascript
// nanoscript

let a = 100;

// use the imported function addNumbers from the module
console.log(addNumbers(a, 10));     // prints 110 to the console


```
*The console object and addNumbers functions are pulled in from the nenv and can be called by name inside of the nanoscript script.*



## Future Features

- **WASM Stack Machine**
    - Currently the stack machine that executes the code is running in javascript (which is slow af). A WASM based approach is being built to improve performance by 100x
- **Custom classes**
    - Adding the ability to define classes, like one would in C++
- **Explicit typing system**
    - Explicit typing when desired, similar to C  ```int x = 0; float y = 0.0;```
- **First class function objects and Closures**
    - Adding a little more javascript spice to the language with closures, arrow functions, and using functions as first class objects (by design)
- **TypedArrayBuffer Syntatic Sugar**
    - I want to add fancy syntactic sugar for js typed arrays. Something like ```int[30]``` in nscript being equal to ```new Int32Array(30)``` under the hood (or even being on the stack in the WASM stack machine)
- **Give me more ideas...**


## License 
This project is licensed under the MIT License. See the LICENSE file for details.
