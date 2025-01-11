import {Tokenizer}  from "./nsengine/tokenizer";
import {Interpreter} from "./nsengine/interpreter";
import { astToString } from "./nsengine/ast";
import { Compiler } from "./nsengine/compiler";
import { Nenv, NenvModule, NenvExport } from "./nsengine/nenv";
import { JSExecutor } from "./nsengine/executor";
import { printProgram } from "./nsengine/program";
import { builtin_module } from "./nenvmodules/builtin";



function tokenize(code: string) {
    let tokenizer = new Tokenizer(code);
    return tokenizer.tokenize();
}

const myModule = {
    name: "myModule",
    exports: [
        { name: "myObject", type: "constant", object: {x: 1, y: 2, z: 3} },
        { name: "myFunction", type: "function", object: (a: number, b: number) => a + b }
    ] as NenvExport[]
} as NenvModule;

const _nenv = new Nenv();
_nenv.addModule(builtin_module);
_nenv.addModule(myModule);

function compile(code: string) {
    let tokenizer = new Tokenizer(code);
    let tokens = tokenizer.tokenize();
    //console.log(tokens);
    let compiler = new Compiler(_nenv, {verboseMode: true});
    let interpreter = new Interpreter(tokens, {verboseMode: true});
    let ast = interpreter.parse();

    console.log(astToString(ast as any));
    return compiler.compile([ast] as any);
}

const script = `
const ob = {
    'x': 1,
    'y': 2,
    'z': {
        'a': 1,
        'b': 2
    }
};

return ob?.z?.b;
`;

const tokeizer = new Tokenizer(script, {
    allowUnknown: true,
    disableReplacements: false,
    keepComments: false,
    keepWhitespace: false,
});

const tokens = tokeizer.tokenize();
console.log(tokens);


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


//printProgram(compile(script));


const executor = new JSExecutor();

let start = performance.now();
const program = compile(script);
let end = performance.now();
console.log("Compiled in " + (end - start) + "ms");

let result = null;


start = performance.now();
result = executor.execute(program);
end = performance.now();
console.log(result + " in " + (end - start) + "ms  (executor)");
console.log(result);  



//const prg2bin = new NSBinaryComplier();
//const binary = prg2bin.compileBinary(program);
//console.log(binary);

// save file
//const fs = require('fs');
//fs.writeFileSync('out.bin', Buffer.from(binary));