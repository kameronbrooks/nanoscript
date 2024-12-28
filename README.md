# nanoscript (nscript)

## current version 0.0.1

nanoscript (nscript) is a lightweight, JavaScript-inspired programming language designed for simple computational tasks in the browser or on the server. Built with TypeScript, it draws inspiration from an earlier C++-based project, clx, and is tailored to address security concerns that arise with JavaScript's `eval`. nscript ensures safe execution of code by limiting access to only explicitly included features through developer-defined modules.

nanoscript operates on a lightweight engine that runs seamlessly in both browser and server environments. Built with TypeScript, nscript code can be executed anywhere JavaScript is supported. While the engine executes code using JavaScript, nanoscript is inherently slower than running equivalent algorithms directly in JavaScript. However, its focus is not on speed but on providing a secure and flexible environment. A typical use case for nanoscript is enabling power-users to write custom logic or advanced configurations to interact with an application safely. Executing external code on a server using `eval` or similar methods can expose the application to significant security risks, as `eval` enables the execution of fully-featured JavaScript, potentially allowing malicious actions.


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
2. [Syntax Overview](#syntax-overview)
3. [License](#license)

---

## Installation

Install using NPM

```npm install @creation-wasteland/nanoscript```

## Usage

Import NSEngine from the module

```import { NSEngine } from "@creation-wasteland/nanoscript";```

Add any required modules so that your API can be called from the engine.

To create a nenv module, define a new nenv.NenvModule with a ```name``` and ```exports```

The ```exports``` property should contain a list of NenvExports. Each export needs to have a ```name```, ```type```, and ```object```.

```typescript
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
const engine = new NSEngine();
engine.addModules([
    myModule,
    ...
])
```

To compile and execute nanoscript code, use the ```compileAndRun``` method


```typescript
const output = engine.compileAndRun(code);
```




## Syntax Overview

Coming soon

## Licence 
This project is licensed under the MIT License. See the LICENSE file for details.
