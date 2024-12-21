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
/*
const script = `
    (1 + 2) * 10
`;

const program = compile(script);

console.log(program);

const executor = new Executor();

const start = performance.now();
const result = executor.execute(program);
const end = performance.now();
console.log(result + " in " + (end - start) + "ms");
*/
/*
const script = `
let a = 0;
let b = 0;
for(let i = 0; i < 100; i++) {
    a = i*2;
    if (a > 50) {
        break;
    }
}
a;
`;
*/
const script = `
let a = 0;
let b = 0;
for(let i = 0; i < 10; i++) {
    for(let j = 0; j < 10; j++) {
        a = i * j;
        console.log(a);
        if (a > 50) {
            console.log("limit hit");
            break 2;
        }
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
const executor = new executor_1.Executor();
let start = performance.now();
const program = compile(script);
let end = performance.now();
console.log("Compiled in " + (end - start) + "ms");
start = performance.now();
const result = executor.execute(program);
end = performance.now();
console.log(result + " in " + (end - start) + "ms");
start = performance.now();
let a = 0;
for (let i = 0; i < 100; i++) {
    a = i * 2;
}
end = performance.now();
console.log(a + " in " + (end - start) + "ms");
