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

Coming soon

## Syntax Overview

Coming soon

## Licence 
This project is licensed under the MIT License. See the LICENSE file for details.
