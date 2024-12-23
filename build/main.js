"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tokenizer_1 = require("./nsengine/tokenizer");
const interpreter_1 = require("./nsengine/interpreter");
const ast_1 = require("./nsengine/ast");
const compiler_1 = require("./nsengine/compiler");
const nenv_1 = require("./nsengine/nenv");
const executor_1 = require("./nsengine/executor");
const program_1 = require("./nsengine/program");
const builtin_1 = require("./nenvmodules/builtin");
const prg2bin_1 = require("./nsengine/prg2bin");
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
        { name: "myObject", type: "constant", object: { x: 1, y: 2, z: 3 } }
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
let a = 0;
let b = 0;
for(let i = 0; i < 10000; i++) {
    for(let j = 0; j < 10000; j++) {
        a = i * j;
    }
}
a;
`;
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
console.log((0, ast_1.astToString)(runCode(script)));
(0, program_1.printProgram)(compile(script));
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
const prg2bin = new prg2bin_1.NSBinaryComplier();
const binary = prg2bin.compileBinary(program);
console.log(binary);
// save file
const fs = require('fs');
fs.writeFileSync('out.bin', Buffer.from(binary));
