import {Tokenizer}  from "../src/nsengine/tokenizer";
import {Interpreter} from "../src/nsengine/interpreter";
import {Compiler} from "../src/nsengine/compiler";
import {JSExecutor} from "../src/nsengine/executor";
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

function execute(code: string) {
    let tokenizer = new Tokenizer(code);
    let tokens = tokenizer.tokenize();
    let interpreter = new Interpreter(tokens);
    let ast = interpreter.parse();
    let program = compiler.compile([ast] as any);
    let executor = new JSExecutor();
    const result = executor.execute(program);

    return result;
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


const validResults = [
// 1-5
    null,
    0,
    -1,
    true,
    false,
// 6-10
    2,
    141,
    11,
    6,
    10,
// 11-15
    100,
    10,
    20,
    10,
    'Hello world',
// 16-20
    'Hello world!',
    ' Hello \' world ',
    ' Hello John',
    5,
    true,
// 21-25
    'x is less than 10',
    'x is less than 10',
    undefined,
    undefined,
    undefined,
// 26-30
    1,
    1,
    undefined,
    1,
    100,
// 31-35
    { x: 100, y: 21, z: 20 },
    [0,1,2,3,4],
    [],
    ['s','t','o','p'],
    {},
// 36-40
    {},
    120,
    8,
    ' Hello 1',
    10

]


const validScripts = [
// 1-5
`null;`,
`0;`,
`-1;`,
`true;`,
`false;`,
// 6-10
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
// 11-15
`
let x = 10;
o.g.f(x.y()).bb(x);`,
`
let x = 10;
o.g.f(x);`,
`(1 + 2) * 10;`,
`let x = 10;`,
"'Hello world';",
// 16-20
"'Hello world' + '!';",
"' Hello \\' world ';",
"let name='john'; `Hello, ${name}`;",
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
// 21-25
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
}`,
`for (let i = 0; i < 10; i++) { 
    console.log(i**2); 
}`,
`for (let i = 0; i < 10; i++) { 
    console.log(i**2); 
}`,
`
let x = 0;
while (x < 10) {
    x++;
}`,
// 26-30
`arr[0];`,
`arr[0];`,
`arr[0].g;`,
`arr[0].g.f();`,
`return {
    'x': (10**2),
    'y': 20 + 1,
    'z': 30
}.x;
`,
// 31-35
`return {
    'x': (10**2),
    'y': 20 + 1,
    'z': 30 - 10
};
`,
`return [0,1,2,3,4];`,
`return [];`,
`return ['s','t','o','p'];`,
`return {};`,
// 36-40
`let x = {};
 return x;`,
 `
 function factorial(n) {
    if (n < 1) {
        return 1;
    }    
    return n * factorial(n - 1);
}
return factorial(5);`,
`
for (let i = 0; i < 10; i++) { 
    console.log(i**2); 
}

//console.log('Hello World');

for (let j = 0; j < 20; j++) { 
    console.log(j**2);
}


return 8;
`,
`
// comment this is a comment
/* this is a block comment */

let arr0 = [1,2,3,4,5];

const s = "hello world";
const s2 = 'hello world';

let sb = \` Hello \${arr0[0]}\`;

arr0[0] = 10;
return sb;
`,
`
    let ob = {
        'x': 10,
        'y': 20,
    };

    return ob.x;
`
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



describe('Execute Vaild Script (correct result)', () => {
    for (let i = 0; i < validScripts.length; i++) {
        const script = validScripts[i];
        const result = validResults[i];

        if (typeof result === 'object') {
            test(script, () => {
                expect(execute(script)).toMatchObject(result as object);
            });
            continue;
        }
        else if (typeof result === 'string') {
            test(script, () => {
                expect(execute(script)).toMatch(result as string);
            });
            continue;
        }
        else if (Array.isArray(result)) {
            test(script, () => {
                expect(execute(script)).toEqual(result);
            });
            continue;
        }
        else {
            test(script, () => {
                expect(execute(script)).toBe(result);
            });
        }

    }
});









