"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tokenizer_1 = require("./nsengine/tokenizer");
const interpreter_1 = require("./nsengine/interpreter");
const compiler_1 = require("./nsengine/compiler");
const nenv_1 = require("./nsengine/nenv");
function runCode(code) {
    let tokenizer = new tokenizer_1.Tokenizer(code);
    let tokens = tokenizer.tokenize();
    console.log(tokens);
    let interpreter = new interpreter_1.Interpreter(tokens);
    return interpreter.parse();
}
function tokenize(code) {
    let tokenizer = new tokenizer_1.Tokenizer(code);
    return tokenizer.tokenize();
}
function compile(code) {
    let nenv = new nenv_1.Nenv();
    let tokenizer = new tokenizer_1.Tokenizer(code);
    let tokens = tokenizer.tokenize();
    let compiler = new compiler_1.Compiler(nenv);
    let interpreter = new interpreter_1.Interpreter(tokens);
    let ast = interpreter.parse();
    return compiler.compile(ast);
}
console.log(compile(`
        1 + 2
    `));
//console.log(runCode("1 + (2 + 3) * 5"));
//console.log(astToString(runCode("1 + 1 + 3 + 5 * 5 * 5 + 4") as any));
//console.log(astToString(runCode("1 + -(-1 + 2) * 10 + 2") as any));
//console.log(astToString(runCode("x.func1.m + 1") as any));
//console.log(astToString(runCode("f(x+1, y(x+2), (2+5))") as any));
//console.log(astToString(runCode("o[0]") as any));
//console.log(astToString(runCode("o[0,1].g") as any));
/*
let tokenizer = new Tokenizer("1 + 2 * 3;");
console.log(tokenizer.tokenize());


tokenizer = new Tokenizer("(1 + 2) * 10;");
console.log(tokenizer.tokenize());

tokenizer = new Tokenizer("let x = 10;");
console.log(tokenizer.tokenize());

tokenizer = new Tokenizer("console.log(x);");
console.log(tokenizer.tokenize());

tokenizer = new Tokenizer(`
for (let i = 0; i < 10; i++) {
    console.log(i**2);
}
`);
console.log(tokenizer.tokenize());
*/ 
