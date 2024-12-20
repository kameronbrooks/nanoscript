import {Tokenizer}  from "./nsengine/tokenizer";
import {Interpreter} from "./nsengine/interpreter";
import { astToString } from "./nsengine/ast";
import { Compiler } from "./nsengine/compiler";
import { Nenv, NenvModule, NenvExport } from "./nsengine/nenv";
import { Executor } from "./nsengine/executor";
import { printProgram } from "./nsengine/program";
import { builtin_module } from "./nenvmodules/builtin";

function runCode(code: string) {
    let tokenizer = new Tokenizer(code);
    let tokens = tokenizer.tokenize();

    console.log(tokens);

    let interpreter = new Interpreter(tokens);
    return interpreter.parse();
}
function tokenize(code: string) {
    let tokenizer = new Tokenizer(code);
    return tokenizer.tokenize();
}



const myModule = {
    name: "myModule",
    exports: [
        { name: "myObject", type: "constant", object: {x: 1, y: 2, z: 3} }
    ] as NenvExport[]
} as NenvModule;

const _nenv = new Nenv();
_nenv.addModule(builtin_module);
_nenv.addModule(myModule);

function compile(code: string) {
    let tokenizer = new Tokenizer(code);
    let tokens = tokenizer.tokenize();
    let compiler = new Compiler(_nenv);
    let interpreter = new Interpreter(tokens);
    let ast = interpreter.parse();

    return compiler.compile([ast] as any);
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

const script = `
let a = 0;
for(let i = 0; i < 100; i++) {
    a = i*2;
}
a;
Math.PI;
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
console.log(astToString(runCode(script) as any));


printProgram(compile(script));

const executor = new Executor();
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
for(let i = 0; i < 100; i++) {
    a = i * 2;
}
end = performance.now();
console.log(a + " in " + (end - start) + "ms");