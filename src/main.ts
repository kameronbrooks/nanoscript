import {Tokenizer}  from "./nsengine/tokenizer";
import {Interpreter} from "./nsengine/interpreter";

function runCode(code: string) {
    let tokenizer = new Tokenizer(code);
    let tokens = tokenizer.tokenize();
    let interpreter = new Interpreter(tokens);
    return interpreter.parse();
}

console.log(runCode("1"));

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