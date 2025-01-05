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
        name: 'int variable declaration',
        code: 'let x = 10;',
        expectedResult: undefined
    } as ValidSyntaxTest,
    {
        name: 'int variable declaration and assignment',
        code: `
        let x = 10;
        x = 20;
        return x;`,
        expectedResult: 20
    } as ValidSyntaxTest,
    {
        name: 'float variable declaration',
        code: 'let x = 10.5;',
        expectedResult: undefined
    } as ValidSyntaxTest,
    {
        name: 'float variable declaration and assignment',
        code: `
        let x = 10.5;
        x = 20.5;
        return x;`,
        expectedResult: 20.5
    },
    {
        name: 'string variable declaration',
        code: 'let x = "hello";',
        expectedResult: undefined
    } as ValidSyntaxTest,
    {
        name : 'string variable declaration and assignment',
        code: `
        let x = "hello";
        x = "world";
        return x;`,
        expectedResult: "world"
    } as ValidSyntaxTest,
    {
        name: 'boolean variable declaration',
        code: 'let x = true;',
        expectedResult: undefined
    } as ValidSyntaxTest,
    {
        name: 'boolean variable declaration and assignment',
        code: `
        let x = true;
        x = false;
        return x;`,
        expectedResult: false
    },
    {
        name: 'list variable declaration',
        code: 'let x = [1,2,3,4,5];',
        expectedResult: undefined
    } as ValidSyntaxTest,
    {
        name: 'list variable declaration and return',
        code: `
        let x = [1,2,3,4,5];
        return x;`,
        expectedResult: [1,2,3,4,5]
    } as ValidSyntaxTest,
    {
        name: 'list variable declaration and assignment',
        code: `
        let x = [1,2,3,4,5];
        x = [5,4,3,2,1];
        return x;`,
        expectedResult: [5,4,3,2,1]
    } as ValidSyntaxTest,
    {
        name: 'list variable element assignment',
        code: `
        let x = [1,2,3,4,5];
        x[0] = 10;
        return x;`,
        expectedResult: [10,2,3,4,5]
    } as ValidSyntaxTest,
    {
        name: 'list variable element increment',
        code: `
        let x = [1,2,3,4,5];
        x[0]++;
        return x;`,
        expectedResult: [2,2,3,4,5]
    } as ValidSyntaxTest,
    {
        name: 'list variable element decrement',
        code: `
        let x = [1,2,3,4,5];
        x[0]--;
        return x;`,
        expectedResult: [0,2,3,4,5]
    } as ValidSyntaxTest,
    {
        name: 'list variable element increment with other element',
        code: `
        let x = [1,2,3,4,5];
        x[0] += x[4];
        return x;`,
        expectedResult: [6,2,3,4,5]
    } as ValidSyntaxTest,
    {
        name: 'list of strings declaration',
        code: `
        let x = ["hello", "world"];
        return x;`,
        expectedResult: ["hello", "world"]
    } as ValidSyntaxTest,
    {
        name: 'list of lists declaration',
        code: `
        let x = [[1,2,3],[4,5,6]];
        return x;`,
        expectedResult: [[1,2,3],[4,5,6]]
    } as ValidSyntaxTest,
    {
        name: 'list of lists indexing',
        code: `
        let x = [[1,2,3],[4,5,6]];
        return x[1][2];`,
        expectedResult: 6
    } as ValidSyntaxTest,
    {
        name: 'object variable declaration',
        code: 'let x = {"a": 1, "b": 2, "c": 3};',
        expectedResult: undefined

    } as ValidSyntaxTest,
    {
        name: 'object variable declaration and return',
        code: `
        let x = {'a': 1, 'b': 2, 'c': 3};
        return x;`,
        expectedResult: {a: 1, b: 2, c: 3}
    } as ValidSyntaxTest,
    {
        name: 'object variable declaration and member access',
        code: `
        let x = {'a': 1, 'b': 2, 'c': 3};
        return x.a;`,
        expectedResult: 1
    } as ValidSyntaxTest,
    {
        name: 'object variable declaration and member assignment',
        code: `
        let x = {'a': 1, 'b': 2, 'c': 3};
        x.a = 10;
        return x;`,
        expectedResult: {a: 10, b: 2, c: 3}
    } as ValidSyntaxTest,
    {
        name: 'object variable declaration and member assignment with other member',
        code: `
        let x = {'a': 1, 'b': 2, 'c': 3};
        x.a = x.c;
        return x;`,
        expectedResult: {a: 3, b: 2, c: 3}
    } as ValidSyntaxTest,
    {
        name: 'object variable declaration and member increment',
        code: `
        let x = {'a': 1, 'b': 2, 'c': 3};
        x.a++;
        return x;`,
        expectedResult: {a: 2, b: 2, c: 3}
    } as ValidSyntaxTest,
    {
        name: "list of objects declaration and return",
        code: `
        let x = [{'a': 1, 'b': 2}, {'a': 3, 'b': 4}];
        return x;`,
        expectedResult: [{a: 1, b: 2}, {a: 3, b: 4}]
    } as ValidSyntaxTest,
    {
        name: "list of objects declaration and member access",
        code: `
        let x = [{'a': 1, 'b': 2}, {'a': 3, 'b': 4}];
        return x[1].a;`,
        expectedResult: 3
    } as ValidSyntaxTest,
    {
        name: "object with list members declaration and return",
        code: `
        let x = {'a': [1,2,3], 'b': [4,5,6]};
        return x;`,
    }
    


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
