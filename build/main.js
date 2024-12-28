"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tokenizer_1 = require("./nsengine/tokenizer");
const interpreter_1 = require("./nsengine/interpreter");
const compiler_1 = require("./nsengine/compiler");
const nenv_1 = require("./nsengine/nenv");
const executor_1 = require("./nsengine/executor");
const builtin_1 = require("./nenvmodules/builtin");
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
const myModule = {
    name: "myModule",
    exports: [
        { name: "myObject", type: "constant", object: { x: 1, y: 2, z: 3 } },
        { name: "myFunction", type: "function", object: (a, b) => a + b }
    ]
};
const _nenv = new nenv_1.Nenv();
_nenv.addModule(builtin_1.builtin_module);
_nenv.addModule(myModule);
function compile(code) {
    let tokenizer = new tokenizer_1.Tokenizer(code);
    let tokens = tokenizer.tokenize();
    let compiler = new compiler_1.Compiler(_nenv);
    let interpreter = new interpreter_1.Interpreter(tokens);
    let ast = interpreter.parse();
    return compiler.compile([ast]);
}
const script = `


console.log(myObject['x']);

`;
/*
const script = `
function func1(a, b) {
    return a - b;
}

function addNums(a, b) {
    let c = a + b;
    if (c > 10) {
        console.log('c is greater than 10');
    }
    return c;
}

for (let i = 0; i < 10; i++) {
    console.log(i);
}
console.log(addNums(1, 2));
`;
*/
/*
const script = `
{
    let x = 10;
    if (x > 10) {
        console.log('x is greater than 10');
        x = myObject.x;
    } else if (x < 10) {
        console.log('x is less than 10');
        x = myObject.y;
    } else{
        console.log('x is equal to 10');
        x = 100;
    }
    x;
}
`;
*/
/*
const script = `
{
    let x = 10;
    x = 9;
    x;
}
`;
*/
//console.log(astToString(runCode(script) as any));
//printProgram(compile(script));
const executor = new executor_1.JSExecutor();
let start = performance.now();
const program = compile(script);
let end = performance.now();
console.log("Compiled in " + (end - start) + "ms");
let result = null;
start = performance.now();
result = executor.execute(program);
end = performance.now();
console.log(result + " in " + (end - start) + "ms  (executor)");
//const prg2bin = new NSBinaryComplier();
//const binary = prg2bin.compileBinary(program);
//console.log(binary);
// save file
//const fs = require('fs');
//fs.writeFileSync('out.bin', Buffer.from(binary));
