import {Tokenizer}  from "./nsengine/tokenizer";
import {Interpreter} from "./nsengine/interpreter";
import { astToString } from "./nsengine/ast";
import { Compiler } from "./nsengine/compiler";
import { Nenv } from "./nsengine/nenv";
import { Executor } from "./nsengine/executor";

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

function compile(code: string) {
    let nenv = new Nenv();
    let tokenizer = new Tokenizer(code);
    let tokens = tokenizer.tokenize();
    let compiler = new Compiler(nenv);
    let interpreter = new Interpreter(tokens);
    let ast = interpreter.parse();

    return compiler.compile([ast] as any);
}

const script = `
    (1 + 2) * 10
`;

const program = compile(script);

console.log(program);

const executor = new Executor();

console.log(executor.execute(program));
//console.log(runCode("1 + (2 + 3) * 5"));
//console.log(astToString(runCode("1 + 1 + 3 + 5 * 5 * 5 + 4") as any));

//console.log(astToString(runCode("1 + -(-1 + 2) * 10 + 2") as any));
//console.log(astToString(runCode("x.func1.m + 1") as any));
//console.log(astToString(runCode("f(x+1, y(x+2), (2+5))") as any));
//console.log(astToString(runCode("o[0]") as any));
//console.log(astToString(runCode("o[0,1].g") as any));
/*
let tokenizer = new Tokenizer("1 + 2 * 3;");
console.log(tokenizer.tokenize());


tokenizer = new Tokenizer("(1 + 2) * 10;");
console.log(tokenizer.tokenize());

tokenizer = new Tokenizer("let x = 10;");
console.log(tokenizer.tokenize());

tokenizer = new Tokenizer("console.log(x);");
console.log(tokenizer.tokenize());

tokenizer = new Tokenizer(`
for (let i = 0; i < 10; i++) {
    console.log(i**2);
}
`);
console.log(tokenizer.tokenize());
*/