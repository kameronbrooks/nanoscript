import {Tokenizer}  from "../src/nsengine/tokenizer";
import {Interpreter} from "../src/nsengine/interpreter";
import {Compiler} from "../src/nsengine/compiler";
import {JSExecutor} from "../src/nsengine/executor";
import * as nenv from "../src/nsengine/nenv";
import { builtin_module } from "../src/nenvmodules/builtin";


export interface ValidSyntaxTest {
    name: string;
    code: string;
    expectedResult: any;
}

export interface InvalidSyntaxTest {
    name: string;
    code: string;
    expectedError: string;
}






export function tokenize(code: string) {
    let tokenizer = new Tokenizer(code);
    return tokenizer.tokenize();
}

export function interpret(code: string) {
    let tokenizer = new Tokenizer(code);
    let tokens = tokenizer.tokenize();
    let interpreter = new Interpreter(tokens);
    return interpreter.parse();
}

export function compile(code: string, compiler: Compiler) {
    let tokenizer = new Tokenizer(code);
    let tokens = tokenizer.tokenize();
    let interpreter = new Interpreter(tokens);
    let ast = interpreter.parse();
    return compiler.compile([ast] as any);
}

export function execute(code: string, compiler: Compiler) {
    let tokenizer = new Tokenizer(code);
    let tokens = tokenizer.tokenize();
    let interpreter = new Interpreter(tokens);
    let ast = interpreter.parse();
    let program = compiler.compile([ast] as any);
    let executor = new JSExecutor();
    const result = executor.execute(program);

    return result;
}

export const myModule = {
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