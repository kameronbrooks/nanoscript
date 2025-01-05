import { ValidSyntaxTest, InvalidSyntaxTest, compile, interpret, execute, tokenize } from "./test_utils.test";
import {Tokenizer}  from "../src/nsengine/tokenizer";
import {Interpreter} from "../src/nsengine/interpreter";
import {Compiler} from "../src/nsengine/compiler";
import {JSExecutor} from "../src/nsengine/executor";
import * as nenv from "../src/nsengine/nenv";
import { builtin_module } from "../src/nenvmodules/builtin";
import { myModule } from "./test_utils.test";

let n_env = new nenv.Nenv();
let compiler = new Compiler(n_env);


const validTests = [
    {
        name: 'null literal',
        code: 'null;',
        expectedResult: null
    } as ValidSyntaxTest,
    {
        name: 'zero literal',
        code: '0;',
        expectedResult: 0
    } as ValidSyntaxTest,
    {
        name: 'one literal',
        code: '1;',
        expectedResult: 1
    } as ValidSyntaxTest,
    {
        name: '1000 literal',
        code: '1000;',
        expectedResult: 1000
    } as ValidSyntaxTest,
    {
        name: 'negative one literal',
        code: '-1;',
        expectedResult: -1
    } as ValidSyntaxTest,
    {
        name: 'true literal',
        code: 'true;',
        expectedResult: true
    } as ValidSyntaxTest,
    {
        name: 'false literal',
        code: 'false;',
        expectedResult: false
    } as ValidSyntaxTest,
    {
        name: 'simple integer addition (1 + 1)',
        code: '1 + 1;',
        expectedResult: 2
    } as ValidSyntaxTest,
    {
        name: 'simple integer subtraction (1 - 1)',
        code: '1 - 1;',
        expectedResult: 0
    } as ValidSyntaxTest,
    {
        name: 'simple integer multiplication (1 * 1)',
        code: '1 * 1;',
        expectedResult: 1
    } as ValidSyntaxTest,
    {
        name: 'simple integer division (2 / 4)',
        code: '2 / 4;',
        expectedResult: 0.5
    } as ValidSyntaxTest,
    {
        name: 'simple integer power (2 ** 2)',
        code: '2 ** 2;',
        expectedResult: 4
    } as ValidSyntaxTest,
    {
        name: 'simple float addition (1.1 + 1.2)',
        code: '1.1 + 1.2;',
        expectedResult: 2.3
    } as ValidSyntaxTest,
    {
        name: 'simple float subtraction (1.1 - 1.2)',
        code: '1.1 - 1.2;',
        expectedResult: -0.1
    } as ValidSyntaxTest,
    {
        name: 'simple float multiplication (1.1 * 1.2)',
        code: '1.1 * 1.2;',
        expectedResult: 1.32
    } as ValidSyntaxTest,
    {
        name: 'simple float division (2.1 / 3.2)',
        code: '2.1 / 3.2;',
        expectedResult: 0.65625
    } as ValidSyntaxTest,
    {
        name: 'simple integer power (2 ** 2)',
        code: '2 ** 2;',
        expectedResult: 4
    } as ValidSyntaxTest,
    {
        name: 'arithmetic integer expression (1 + 1 + 3 + 5 * 5 * 5 + 4)',
        code: '1 + 1 + 3 + 5 * 5 * 5 + 4;',
        expectedResult: 134
    } as ValidSyntaxTest,
    {
        name: 'arithmetic integer expression (1 + -(-1 + 2) * 10 + 2)',
        code: '1 + -(-1 + 2) * 10 + 2;',
        expectedResult: -7
    } as ValidSyntaxTest,
    {
        name: 'arithmetic float expression (1.1 + 1.2 + 3.3 + 5.5 * 5.5 * 5.5 + 4.4)',
        code: '1.1 + 1.2 + 3.3 + 5.5 * 5.5 * 5.5 + 4.4;',
        expectedResult: 176.375
    } as ValidSyntaxTest,
    {
        name: 'arithmetic float expression (1.1 + -(-1.1 + 2.2) * 10.1 + 2.2)',
        code: '1.1 + -(-1.1 + 2.2) * 10.1 + 2.2;',
        expectedResult: 
        -7.810000000000001
    } as ValidSyntaxTest,
    {
        name: 'simple float power (2.2 ** 2.2)',
        code: '2.2 ** 2.2;',
        expectedResult: 5.66669577875008
    } as ValidSyntaxTest,
    {
        name: 'simple integer modulo (5 % 2)',
        code: '5 % 2;',
        expectedResult: 1
    } as ValidSyntaxTest,
    {
        name: 'simple float modulo (5.5 % 2.2)',
        code: '5.5 % 2.2;',
        expectedResult: 1.1
    } as ValidSyntaxTest,
    {
        name: 'simple integer and float addition (1 + 1.1)',
        code: '1 + 1.1;',
        expectedResult: 2.1
    } as ValidSyntaxTest,
    {
        name: 'simple integer and float subtraction (1 - 1.1)',
        code: '1 - 1.1;',
        expectedResult: -0.1
    } as ValidSyntaxTest,
    {
        name: 'simple integer and float multiplication (1 * 1.1)',
        code: '1 * 1.1;',
        expectedResult: 1.1
    } as ValidSyntaxTest,
    {
        name: 'simple integer and float division (2 / 3.2)',
        code: '2 / 3.2;',
        expectedResult: 0.625
    } as ValidSyntaxTest,
    {
        name: 'simple integer and float power (2 ** 2.2)',
        code: '2 ** 2.2;',
        expectedResult: 4.59479342
    } as ValidSyntaxTest,
    {
        name: 'simple integer and float modulo (5 % 2.2)',
        code: '5 % 2.2;',
        expectedResult: 0.6
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
