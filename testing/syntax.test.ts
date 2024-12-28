import {Tokenizer}  from "../src/nsengine/tokenizer";
import {Interpreter} from "../src/nsengine/interpreter";
import {Compiler} from "../src/nsengine/compiler";
import * as nenv from "../src/nsengine/nenv";
import { builtin_module } from "../src/nenvmodules/builtin";


let n_env = new nenv.Nenv();
let compiler = new Compiler(n_env);

function tokenize(code: string) {
    let tokenizer = new Tokenizer(code);
    return tokenizer.tokenize();
}

function interpret(code: string) {
    let tokenizer = new Tokenizer(code);
    let tokens = tokenizer.tokenize();
    let interpreter = new Interpreter(tokens);
    return interpreter.parse();
}

function compile(code: string) {
    let tokenizer = new Tokenizer(code);
    let tokens = tokenizer.tokenize();
    let interpreter = new Interpreter(tokens);
    let ast = interpreter.parse();
    return compiler.compile([ast] as any);
}

const myModule = {
    name: "myModule",
    exports: [
        { name: "myObject", type: "constant", object: {x: 1, y: 2, z: 3} },
        { name: "myFunction", type: "function", object: (a: number, b: number) => a + b },
        { name: "o", type: "constant", object: {
            g: {
                f: (x: number) => {
                    return {
                        bb: (y: number) => x + y
                    }
                }
            },
            func1: () => ({m: 5}),
            y: (x:number) => x + 1
        } },
        { name: "arr", type: "constant", object: [{g: {f: () => 1}}, {g: {f: () => 2}}] },
        { name: "func0", type: "function", object: (a: number, b: number, c: number) => a + b + c }


    ] as nenv.NenvExport[]
} as nenv.NenvModule;





const validScripts = [
`null;`,
`0;`,
`-1;`,
`true;`,
`false;`,
`1 + 1;`,
`1 + 1 + 3 + 5 * 5 * 5 + 4;`,
`1 + -(-1 + 2) * 10 + 2;`,
`o.func1.m + 1;`,
`
let x = 5;
function y(a) {
    return a + 1;
}
func0(x+1, y(x+2), (2+5));`,
`
let x = 10;
o.g.f(x.y()).bb(x);`,
`
let x = 10;
o.g.f(x);`,
`(1 + 2) * 10;`,
`let x = 10;`,
"'Hello world';",
"'Hello world' + '!';",
"' Hello \\' world ';",
"`Hello, ${name}`;",
`
let x = 5;
console.log(x);
`,
`
let x = 5;
if (x > 10) {
    console.log('x is greater than 10');
}
`,
`
let x = 5;
if (x > 10) {
    console.log('x is greater than 10');
} else {
    console.log('x is less than 10');
}
`,
`
let x = 5;
if (x > 10) {
    console.log('x is greater than 10');
} else if (x < 10) {
    console.log('x is less than 10');
} else {
    console.log('x is equal to 10');
}
`,
`
}
`,
`for (let i = 0; i < 10; i++) { 
    console.log(i**2); 
}`,
`for (let i = 0; i < 10; i++) { 
    console.log(i**2); 
}`,
`arr[0];`,
`arr[0];`,
`arr[0].g;`,
`arr[0].g.f();`,
];

beforeAll(() => {
    n_env = new nenv.Nenv();
    n_env.addModule(myModule);
    n_env.addModule(builtin_module);
    compiler = new Compiler(n_env);
});

beforeEach(() => {

});



describe('Tokenize Valid Script', () => {
    for (let script of validScripts) {
        test(script, () => {
            expect(()=>tokenize(script)).not.toThrow();
        });
    }
});


describe('Parse Valid Script', () => {
    for (let script of validScripts) {
        test(script, () => {
            expect(()=>interpret(script)).not.toThrow();
        });
    }
});

describe('Compile Vaild Script', () => {
    for (let script of validScripts) {
        test(script, () => {
            expect(()=>compile(script)).not.toThrow();
        });
    }
});







