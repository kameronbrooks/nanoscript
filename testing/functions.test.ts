import { ValidSyntaxTest, InvalidSyntaxTest, compile, interpret, execute, tokenize } from "./test_utils";
import {Tokenizer}  from "../src/nsengine/tokenizer";
import {Interpreter} from "../src/nsengine/interpreter";
import {Compiler} from "../src/nsengine/compiler";
import {JSExecutor} from "../src/nsengine/executor";
import * as nenv from "../src/nsengine/nenv";
import { builtin_module } from "../src/nenvmodules/builtin";
import { myModule } from "./test_utils";

let n_env = new nenv.Nenv();
let compiler = new Compiler(n_env);


const validTests = [
    {
        name: 'foreach loop in function',
        code: `
function f() {
  let output = 10;
  let e = 5;
  for (y in 0...e) {
    output+= y;
  }
  return output; 
}

let output = 10;
let e = 5;
for (y in 0...e) {
    output += y;
}
console.log(output);

return f(5); 
`,
        expectedResult: undefined
    } as ValidSyntaxTest,
    {
        name: 'recursive function',
        code: `
function factorial(n) {
    if (n == 0) {
        return 1;  
    }
    return n * factorial(n-1);
} 

return factorial(5);


        `,
        expectedResult: 120
    } as ValidSyntaxTest,
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
    for (let t of validTests) {
        test(t.name, () => {
            expect(()=>tokenize(t.code)).not.toThrow();
        });
    }
});

describe('Parse Valid Script', () => {
    for (let t of validTests) {
        test(t.name, () => {
            expect(()=>interpret(t.code)).not.toThrow();
        });
    }
});

describe('Compile Vaild Script', () => {
    for (let t of validTests) {
        test(t.name, () => {
            expect(()=>compile(t.code, compiler)).not.toThrow();
        });
    }
});

describe('Execute Vaild Script (correct result)', () => {
    for (let t of validTests) {
        const result = t.expectedResult;
        const script = t.code;
        if (result === undefined) {
            continue;
        }
        if (result === null) {
            test(script, () => {
                expect(execute(script, compiler)).toBeNull();
            });
            continue;
        }
        if (typeof result === 'number') {
            test(script, () => {
                expect(execute(script, compiler)).toBeCloseTo(result as number, 5);
            });
            continue;
        }
        if (typeof result === 'object') {
            test(script, () => {
                expect(execute(script, compiler)).toMatchObject(result as object);
            });
            continue;
        }
        else if (typeof result === 'string') {
            test(script, () => {
                expect(execute(script, compiler)).toMatch(result as string);
            });
            continue;
        }
        else if (Array.isArray(result)) {
            test(script, () => {
                expect(execute(script, compiler)).toEqual(result);
            });
            continue;
        }
        else {
            test(script, () => {
                expect(execute(script, compiler)).toBe(result);
            });
        }
    }
});
