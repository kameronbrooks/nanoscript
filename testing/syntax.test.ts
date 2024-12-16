import {Tokenizer}  from "../src/nsengine/tokenizer";
import {Interpreter} from "../src/nsengine/interpreter";

function runCode(code: string) {
    let tokenizer = new Tokenizer(code);
    let tokens = tokenizer.tokenize();
    let interpreter = new Interpreter(tokens);
    return interpreter.parse();
}


const script1 = `1 + 1`;
const script2 = `1 + 1 + 3 + 5 * 5 * 5 + 4`;
const script3 = `1 + -(-1 + 2) * 10 + 2`;
const script4 = `x.func1.m + 1`;
const script5 = `f(x+1, y(x+2), (2+5))`;
const script6 = `o.g.f(x.y()).bb(x)`;
const script7 = `o.g.f(x)`;
const script8 = `(1 + 2) * 10`;
const script9 = `let x = 10`;
const script10 = `console.log(x)`;
const script11 = `
for (let i = 0; i < 10; i++) { 
    console.log(i**2); 
}`;
const script12 = `arr[0]`;


test("Compile: " + script1, () => {
    expect(()=>runCode(script1)).not.toThrow();
});

test("Compile: " + script2, () => {
    expect(()=>runCode(script2)).not.toThrow();
});

test("Compile: " + script3, () => {
    expect(()=>runCode(script3)).not.toThrow();
});

test("Compile: " + script4, () => {
    expect(()=>runCode(script4)).not.toThrow();
});

test("Compile: " + script5, () => {
    expect(()=>runCode(script5)).not.toThrow();
});

test("Compile: " + script6, () => {
    expect(()=>runCode(script6)).not.toThrow();
});

test("Compile: " + script7, () => {
    expect(()=>runCode(script7)).not.toThrow();
});

test("Compile: " + script8, () => {
    expect(()=>runCode(script8)).not.toThrow();
});

test("Compile: " + script9, () => {
    expect(()=>runCode(script9)).not.toThrow();
});

test("Compile: " + script10, () => {
    expect(()=>runCode(script10)).not.toThrow();
});

test("Compile: " + script11, () => {
    expect(()=>runCode(script11)).not.toThrow();
});

test("Compile: " + script12, () => {
    expect(()=>runCode(script12)).not.toThrow();
});

