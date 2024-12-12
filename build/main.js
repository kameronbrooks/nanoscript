"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const interpreter_1 = require("./nsengine/interpreter");
let tokenizer = new interpreter_1.Tokenizer("1 + 2 * 3");
console.log(tokenizer.tokenize());
tokenizer = new interpreter_1.Tokenizer("(1 + 2) * 10");
console.log(tokenizer.tokenize());
tokenizer = new interpreter_1.Tokenizer("let x = 10;");
console.log(tokenizer.tokenize());
tokenizer = new interpreter_1.Tokenizer("console.log(x);");
console.log(tokenizer.tokenize());
tokenizer = new interpreter_1.Tokenizer(`
for (let i = 0; i < 10; i++) {
    console.log(i**2);
}
`);
console.log(tokenizer.tokenize());
