"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OP_LOAD_MEMBER = exports.OP_STORE_LOCAL = exports.OP_LOAD_LOCAL = exports.OP_FLOAT_TO_STRING = exports.OP_INT_TO_STRING = exports.OP_FLOAT_TO_INT = exports.OP_INT_TO_FLOAT = exports.OP_DECREMENT_LOCAL_POST = exports.OP_INCREMENT_LOCAL_POST = exports.OP_NEGf = exports.OP_NEGi = exports.OP_NOT_EQUALs = exports.OP_EQUALs = exports.OP_NOT_EQUALb = exports.OP_EQUALb = exports.OP_NOT_EQUALf = exports.OP_EQUALf = exports.OP_LESS_THAN_OR_EQUALf = exports.OP_GREATER_THAN_OR_EQUALf = exports.OP_LESS_THANf = exports.OP_GREATER_THANf = exports.OP_NOT_EQUALi = exports.OP_EQUALi = exports.OP_LESS_THAN_OR_EQUALi = exports.OP_GREATER_THAN_OR_EQUALi = exports.OP_LESS_THANi = exports.OP_GREATER_THANi = exports.OP_ADDs = exports.OP_POWf = exports.OP_MODf = exports.OP_DIVf = exports.OP_MULf = exports.OP_SUBf = exports.OP_ADDf = exports.OP_POWi = exports.OP_MODi = exports.OP_DIVi = exports.OP_MULi = exports.OP_SUBi = exports.OP_ADDi = exports.OP_LOAD_CONST_STRING = exports.OP_LOAD_CONST_NULL = exports.OP_LOAD_CONST_FLOAT = exports.OP_LOAD_CONST_INT = exports.OP_LOAD_CONST_BOOL = exports.OP_BRANCH_FALSE = exports.OP_BRANCH_TRUE = exports.OP_JUMP = exports.OP_TERM = exports.OP_NOOP = void 0;
exports.IMPLICIT_CONVERSION_MAP = exports.OP_MAP = exports.OP_CALL_EXTERNAL = exports.OP_CALL_INTERNAL = exports.OP_POP_HEAP = exports.OP_ALLOC_HEAP = exports.OP_POP_STACK = exports.OP_ALLOC_STACK = exports.OP_STORE_ELEMENT = exports.OP_LOAD_ELEMENT = exports.OP_LOAD_EXTERNAL = exports.OP_STORE_MEMBER = void 0;
exports.getOpName = getOpName;
exports.searchOpMap = searchOpMap;
exports.printInstruction = printInstruction;
exports.removeInstructionMetadata = removeInstructionMetadata;
exports.createProgram = createProgram;
exports.programToString = programToString;
exports.printProgram = printProgram;
const nenv_1 = require("./nenv");
let i = 0;
exports.OP_NOOP = i++;
exports.OP_TERM = i++;
exports.OP_JUMP = i++;
exports.OP_BRANCH_TRUE = i++;
exports.OP_BRANCH_FALSE = i++;
// ============= STACK OPERATIONS =============
exports.OP_LOAD_CONST_BOOL = i++;
exports.OP_LOAD_CONST_INT = i++;
exports.OP_LOAD_CONST_FLOAT = i++;
exports.OP_LOAD_CONST_NULL = i++;
exports.OP_LOAD_CONST_STRING = i++;
// ============= BINARY OPERATIONS =============
exports.OP_ADDi = i++;
exports.OP_SUBi = i++;
exports.OP_MULi = i++;
exports.OP_DIVi = i++;
exports.OP_MODi = i++;
exports.OP_POWi = i++;
exports.OP_ADDf = i++;
exports.OP_SUBf = i++;
exports.OP_MULf = i++;
exports.OP_DIVf = i++;
exports.OP_MODf = i++;
exports.OP_POWf = i++;
exports.OP_ADDs = i++;
exports.OP_GREATER_THANi = i++;
exports.OP_LESS_THANi = i++;
exports.OP_GREATER_THAN_OR_EQUALi = i++;
exports.OP_LESS_THAN_OR_EQUALi = i++;
exports.OP_EQUALi = i++;
exports.OP_NOT_EQUALi = i++;
exports.OP_GREATER_THANf = i++;
exports.OP_LESS_THANf = i++;
exports.OP_GREATER_THAN_OR_EQUALf = i++;
exports.OP_LESS_THAN_OR_EQUALf = i++;
exports.OP_EQUALf = i++;
exports.OP_NOT_EQUALf = i++;
exports.OP_EQUALb = i++;
exports.OP_NOT_EQUALb = i++;
exports.OP_EQUALs = i++;
exports.OP_NOT_EQUALs = i++;
// ============= UNARY OPERATIONS =============
exports.OP_NEGi = i++;
exports.OP_NEGf = i++;
exports.OP_INCREMENT_LOCAL_POST = i++;
exports.OP_DECREMENT_LOCAL_POST = i++;
// ============= CONVERSION OPERATIONS =============
exports.OP_INT_TO_FLOAT = i++;
exports.OP_FLOAT_TO_INT = i++;
exports.OP_INT_TO_STRING = i++;
exports.OP_FLOAT_TO_STRING = i++;
// ============== VARIABLE OPERATIONS =============
exports.OP_LOAD_LOCAL = i++;
exports.OP_STORE_LOCAL = i++;
exports.OP_LOAD_MEMBER = i++;
exports.OP_STORE_MEMBER = i++;
exports.OP_LOAD_EXTERNAL = i++;
exports.OP_LOAD_ELEMENT = i++;
exports.OP_STORE_ELEMENT = i++;
exports.OP_ALLOC_STACK = i++;
exports.OP_POP_STACK = i++;
exports.OP_ALLOC_HEAP = i++;
exports.OP_POP_HEAP = i++;
// ============== FUNCTION OPERATIONS =============
exports.OP_CALL_INTERNAL = i++;
exports.OP_CALL_EXTERNAL = i++;
const OP_NAMES = [
    'OP_NOOP',
    'OP_TERM',
    'OP_JUMP',
    'OP_BRANCH_TRUE',
    'OP_BRANCH_FALSE',
    'OP_LOAD_CONST_BOOL',
    'OP_LOAD_CONST_INT',
    'OP_LOAD_CONST_FLOAT',
    'OP_LOAD_CONST_NULL',
    'OP_LOAD_CONST_STRING',
    'OP_ADDi',
    'OP_SUBi',
    'OP_MULi',
    'OP_DIVi',
    'OP_MODi',
    'OP_POWi',
    'OP_ADDf',
    'OP_SUBf',
    'OP_MULf',
    'OP_DIVf',
    'OP_MODf',
    'OP_POWf',
    'OP_ADDs',
    'OP_GREATER_THANi',
    'OP_LESS_THANi',
    'OP_GREATER_THAN_OR_EQUALi',
    'OP_LESS_THAN_OR_EQUALi',
    'OP_EQUALi',
    'OP_NOT_EQUALi',
    'OP_GREATER_THANf',
    'OP_LESS_THANf',
    'OP_GREATER_THAN_OR_EQUALf',
    'OP_LESS_THAN_OR_EQUALf',
    'OP_EQUALf',
    'OP_NOT_EQUALf',
    'OP_EQUALb',
    'OP_NOT_EQUALb',
    'OP_EQUALs',
    'OP_NOT_EQUALs',
    'OP_NEGi',
    'OP_NEGf',
    'OP_INCREMENT_LOCAL_POST',
    'OP_DECREMENT_LOCAL_POST',
    'OP_INT_TO_FLOAT',
    'OP_FLOAT_TO_INT',
    'OP_INT_TO_STRING',
    'OP_FLOAT_TO_STRING',
    'OP_LOAD_LOCAL',
    'OP_STORE_LOCAL',
    'OP_LOAD_MEMBER',
    'OP_STORE_MEMBER',
    'OP_LOAD_EXTERNAL',
    'OP_LOAD_ELEMENT',
    'OP_STORE_ELEMENT',
    'OP_ALLOC_STACK',
    'OP_POP_STACK',
    'OP_ALLOC_HEAP',
    'OP_POP_HEAP',
    'OP_CALL_INTERNAL',
    'OP_CALL_EXTERNAL',
];
function getOpName(opcode) {
    return OP_NAMES[opcode];
}
exports.OP_MAP = {
    '-int': { opcode: exports.OP_NEGi, returnDtype: 'int' },
    // This is for the any case (kind of a hack)
    'any+any': { opcode: exports.OP_ADDi, returnDtype: 'int' },
    'any-any': { opcode: exports.OP_SUBi, returnDtype: 'int' },
    'any*any': { opcode: exports.OP_MULi, returnDtype: 'int' },
    'any/any': { opcode: exports.OP_DIVi, returnDtype: 'int' },
    'any%any': { opcode: exports.OP_MODi, returnDtype: 'int' },
    'any==any': { opcode: exports.OP_EQUALi, returnDtype: 'bool' },
    'any!=any': { opcode: exports.OP_NOT_EQUALi, returnDtype: 'bool' },
    'any>any': { opcode: exports.OP_GREATER_THANi, returnDtype: 'bool' },
    'any<any': { opcode: exports.OP_LESS_THANi, returnDtype: 'bool' },
    'any>=any': { opcode: exports.OP_GREATER_THAN_OR_EQUALi, returnDtype: 'bool' },
    'any<=any': { opcode: exports.OP_LESS_THAN_OR_EQUALi, returnDtype: 'bool' },
    'any++': { opcode: exports.OP_INCREMENT_LOCAL_POST, returnDtype: 'int' },
    'any--': { opcode: exports.OP_DECREMENT_LOCAL_POST, returnDtype: 'int' },
    // Int
    'int+int': { opcode: exports.OP_ADDi, returnDtype: 'int' },
    'int-int': { opcode: exports.OP_SUBi, returnDtype: 'int' },
    'int*int': { opcode: exports.OP_MULi, returnDtype: 'int' },
    'int/int': { opcode: exports.OP_DIVi, returnDtype: 'int' },
    'int%int': { opcode: exports.OP_MODi, returnDtype: 'int' },
    'int**int': { opcode: exports.OP_POWi, returnDtype: 'int' },
    // Float
    '-float': { opcode: exports.OP_NEGf, returnDtype: 'float' },
    'float+float': { opcode: exports.OP_ADDf, returnDtype: 'float' },
    'float-float': { opcode: exports.OP_SUBf, returnDtype: 'float' },
    'float*float': { opcode: exports.OP_MULf, returnDtype: 'float' },
    'float/float': { opcode: exports.OP_DIVf, returnDtype: 'float' },
    'float%float': { opcode: exports.OP_MODf, returnDtype: 'float' },
    'float**float': { opcode: exports.OP_POWf, returnDtype: 'float' },
    'string+string': { opcode: exports.OP_ADDs, returnDtype: 'string' },
    '(float)int': { opcode: exports.OP_INT_TO_FLOAT, returnDtype: 'float' },
    '(int)float': { opcode: exports.OP_FLOAT_TO_INT, returnDtype: 'int' },
    '(string)int': { opcode: exports.OP_INT_TO_STRING, returnDtype: 'string' },
    '(string)float': { opcode: exports.OP_FLOAT_TO_STRING, returnDtype: 'string' },
    'int==int': { opcode: exports.OP_EQUALi, returnDtype: 'bool' },
    'int!=int': { opcode: exports.OP_NOT_EQUALi, returnDtype: 'bool' },
    'int>int': { opcode: exports.OP_GREATER_THANi, returnDtype: 'bool' },
    'int<int': { opcode: exports.OP_LESS_THANi, returnDtype: 'bool' },
    'int>=int': { opcode: exports.OP_GREATER_THAN_OR_EQUALi, returnDtype: 'bool' },
    'int<=int': { opcode: exports.OP_LESS_THAN_OR_EQUALi, returnDtype: 'bool' },
    'float==float': { opcode: exports.OP_EQUALf, returnDtype: 'bool' },
    'float!=float': { opcode: exports.OP_NOT_EQUALf, returnDtype: 'bool' },
    'float>float': { opcode: exports.OP_GREATER_THANf, returnDtype: 'bool' },
    'float<float': { opcode: exports.OP_LESS_THANf, returnDtype: 'bool' },
    'float>=float': { opcode: exports.OP_GREATER_THAN_OR_EQUALf, returnDtype: 'bool' },
    'float<=float': { opcode: exports.OP_LESS_THAN_OR_EQUALf, returnDtype: 'bool' },
    'bool==bool': { opcode: exports.OP_EQUALb, returnDtype: 'bool' },
    'bool!=bool': { opcode: exports.OP_NOT_EQUALb, returnDtype: 'bool' },
    'string==string': { opcode: exports.OP_EQUALs, returnDtype: 'bool' },
    'string!=string': { opcode: exports.OP_NOT_EQUALs, returnDtype: 'bool' },
    'int++': { opcode: exports.OP_INCREMENT_LOCAL_POST, returnDtype: 'int' },
    'int--': { opcode: exports.OP_DECREMENT_LOCAL_POST, returnDtype: 'int' },
    'float++': { opcode: exports.OP_INCREMENT_LOCAL_POST, returnDtype: 'float' },
    'float--': { opcode: exports.OP_DECREMENT_LOCAL_POST, returnDtype: 'float' },
};
exports.IMPLICIT_CONVERSION_MAP = {
    '(float)int': { opcode: exports.OP_INT_TO_FLOAT, returnDtype: 'float' },
    '(string)int': { opcode: exports.OP_INT_TO_STRING, returnDtype: 'string' },
    '(string)float': { opcode: exports.OP_FLOAT_TO_STRING, returnDtype: 'string' },
};
/**
 * Search the OP_MAP for the given key
 * @param opKey
 * @returns
 */
function searchOpMap(opKey) {
    return exports.OP_MAP[opKey];
}
function printInstruction(instruction) {
    return `${getOpName(instruction.opcode)} ${instruction.operand}`;
}
function removeInstructionMetadata(instruction) {
    return {
        opcode: instruction.opcode,
        operand: instruction.operand,
    };
}
/**
 * A constructor for the Program object
 * @param engineVersion
 * @param instructions
 * @param nenv
 * @returns
 */
function createProgram(engineVersion, instructions, nenv) {
    return {
        engineVersion,
        nenv: nenv || new nenv_1.Nenv(),
        instructions: instructions || [],
    };
}
/**
 * Return the string representation of the program
 * @param program
 * @returns
 */
function programToString(program) {
    let output = `nscrpt v${program.engineVersion}\n`;
    for (let i = 0; i < program.instructions.length; i++) {
        let instruction = program.instructions[i];
        output += `[${i}]\t${getOpName(instruction.opcode)} ${instruction.operand}\n`;
    }
    return output;
}
/**
 * Print the program to the console
 * @param program
 */
function printProgram(program) {
    console.log(`nscrpt v${program.engineVersion}`);
    for (let i = 0; i < program.instructions.length; i++) {
        let instruction = program.instructions[i];
        let operandDisplay = instruction.operand;
        if (instruction.operand === null) {
            operandDisplay = '';
        }
        console.log(`[${i}]\t${getOpName(instruction.opcode)}\t${operandDisplay}`);
    }
}
