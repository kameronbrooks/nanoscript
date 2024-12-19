"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tokenizer_1 = require("./nsengine/tokenizer");
const interpreter_1 = require("./nsengine/interpreter");
const ast_1 = require("./nsengine/ast");
const compiler_1 = require("./nsengine/compiler");
const nenv_1 = require("./nsengine/nenv");
const executor_1 = require("./nsengine/executor");
const program_1 = require("./nsengine/program");
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
const consoleModule = {
    name: "io",
    exports: [
        { name: "console", type: "object", object: {
                log: (x) => console.log(x),
                error: (x) => console.error(x),
                warn: (x) => console
            } }
    ]
};
const mathModule = {
    name: "math",
    exports: [
        { name: "PI", type: "constant", object: Math.PI },
        { name: "E", type: "constant", object: Math.E },
        { name: "abs", type: "function", object: Math.abs },
        { name: "acos", type: "function", object: Math.acos },
        { name: "acosh", type: "function", object: Math.acosh },
        { name: "asin", type: "function", object: Math.asin },
        { name: "asinh", type: "function", object: Math.asinh },
        { name: "atan", type: "function", object: Math.atan },
        { name: "atanh", type: "function", object: Math.atanh },
        { name: "atan2", type: "function", object: Math.atan2 },
        { name: "cbrt", type: "function", object: Math.cbrt },
        { name: "ceil", type: "function", object: Math.ceil },
        { name: "clz32", type: "function", object: Math.clz32 },
        { name: "cos", type: "function", object: Math.cos },
        { name: "cosh", type: "function", object: Math.cosh },
        { name: "exp", type: "function", object: Math.exp },
        { name: "expm1", type: "function", object: Math.expm1 },
        { name: "floor", type: "function", object: Math.floor },
        { name: "fround", type: "function", object: Math.fround },
        { name: "hypot", type: "function", object: Math.hypot },
        { name: "imul", type: "function", object: Math.imul },
        { name: "log", type: "function", object: Math.log },
        { name: "log1p", type: "function", object: Math.log1p },
        { name: "log10", type: "function", object: Math.log10 },
        { name: "log2", type: "function", object: Math.log2 },
    ]
};
const myModule = {
    name: "myModule",
    exports: [
        { name: "myObject", type: "constant", object: { x: 1, y: 2, z: 3 } }
    ]
};
const _nenv = new nenv_1.Nenv();
_nenv.addModule(consoleModule);
_nenv.addModule(mathModule);
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
const script = `{
let a = 0;
for(let i = 0; i < 100; i++) {
    a = i*2;
}
}`;
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
