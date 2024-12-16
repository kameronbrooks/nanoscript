import {Tokenizer}  from "../src/nsengine/tokenizer";
import {Interpreter} from "../src/nsengine/interpreter";

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


const validScripts = [
`null`,
`0`,
`-1`,
`true`,
`false`,
`1 + 1`,
`1 + 1 + 3 + 5 * 5 * 5 + 4`,
`1 + -(-1 + 2) * 10 + 2`,
`x.func1.m + 1`,
`f(x+1, y(x+2), (2+5))`,
`o.g.f(x.y()).bb(x)`,
`o.g.f(x)`,
`(1 + 2) * 10`,
`let x = 10`,
"`Hello, ${name}`",
`console.log(x)`,
`for (let i = 0; i < 10; i++) { 
    console.log(i**2); 
}`,
`arr[0]`,
`arr[0,1]`,
`arr[0,1].g`,
`arr[0,1].g.f()`,
];



for (let script of validScripts) {
    test("Tokenize (Valid): " + script.substring(100), () => {
        expect(()=>tokenize(script)).not.toThrow();
    });
}



for (let script of validScripts) {
    test("Compile (Valid): " + script.substring(100), () => {
        expect(()=>runCode(script)).not.toThrow();
    });
}
