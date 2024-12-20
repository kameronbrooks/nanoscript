import {Tokenizer}  from "../src/nsengine/tokenizer";
import {Interpreter} from "../src/nsengine/interpreter";
import * as nenv from "../src/nsengine/nenv";

function tokenize(code: string) {
    let tokenizer = new Tokenizer(code);
    return tokenizer.tokenize();
}

function runCode(code: string) {
    let tokenizer = new Tokenizer(code);
    let tokens = tokenizer.tokenize();
    let interpreter = new Interpreter(tokens);
    return interpreter.parse();
}

const consoleModule = {
    name: "io",
    exports: [
        { name: "console", type: "object", object: {
            log: (x: any) => console.log(x),
            error: (x: any) => console.error(x),
            warn: (x: any) => console
        }}
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
`x.func1.m + 1;`,
`f(x+1, y(x+2), (2+5));`,
`o.g.f(x.y()).bb(x);`,
`o.g.f(x);`,
`(1 + 2) * 10;`,
`let x = 10;`,
"'Hello world';",
"'Hello world' + '!';",
"' Hello \\' world ';",
"`Hello, ${name}`;",
`console.log(x);`,
`
if (x > 10) {
    console.log('x is greater than 10');
}
`,
`
if (x > 10) {
    console.log('x is greater than 10');
} else {
    console.log('x is less than 10');
}
`,
`
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
`arr[0];`,
`arr[0,1];`,
`arr[0,1].g;`,
`arr[0,1].g.f();`,
];

beforeAll(() => {
    const n_env = new nenv.Nenv();
    n_env.addModule(consoleModule);
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
            expect(()=>runCode(script)).not.toThrow();
        });
    }
});






