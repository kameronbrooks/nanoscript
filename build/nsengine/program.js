"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OP_LOAD_MEMBER = exports.OP_STORE_LOCAL = exports.OP_LOAD_LOCAL = exports.OP_FLOAT_TO_STRING = exports.OP_INT_TO_STRING = exports.OP_FLOAT_TO_INT = exports.OP_INT_TO_FLOAT = exports.OP_DECREMENT_LOCAL_POST = exports.OP_INCREMENT_LOCAL_POST = exports.OP_NEGf = exports.OP_NEGi = exports.OP_NOT_EQUALs = exports.OP_EQUALs = exports.OP_NOT_EQUALb = exports.OP_EQUALb = exports.OP_NOT_EQUALf = exports.OP_EQUALf = exports.OP_LESS_THAN_OR_EQUALf = exports.OP_GREATER_THAN_OR_EQUALf = exports.OP_LESS_THANf = exports.OP_GREATER_THANf = exports.OP_NOT_EQUALi = exports.OP_EQUALi = exports.OP_LESS_THAN_OR_EQUALi = exports.OP_GREATER_THAN_OR_EQUALi = exports.OP_LESS_THANi = exports.OP_GREATER_THANi = exports.OP_ADDs = exports.OP_POWf = exports.OP_MODf = exports.OP_DIVf = exports.OP_MULf = exports.OP_SUBf = exports.OP_ADDf = exports.OP_POWi = exports.OP_MODi = exports.OP_DIVi = exports.OP_MULi = exports.OP_SUBi = exports.OP_ADDi = exports.OP_LOAD_CONST_STRING = exports.OP_LOAD_CONST_NULL = exports.OP_LOAD_CONST_FLOAT = exports.OP_LOAD_CONST_INT = exports.OP_LOAD_CONST_BOOL = exports.OP_BRANCH_FALSE = exports.OP_BRANCH_TRUE = exports.OP_JUMP = exports.OP_TERM = exports.OP_NOOP = void 0;
exports.IMPLICIT_CONVERSION_MAP = exports.OP_MAP = exports.OP_CALL_EXTERNAL = exports.OP_CALL_INTERNAL = exports.OP_POP_HEAP = exports.OP_ALLOC_HEAP = exports.OP_POP_STACK = exports.OP_ALLOC_STACK = exports.OP_STORE_ELEMENT = exports.OP_LOAD_ELEMENT = exports.OP_LOAD_EXTERNAL = exports.OP_STORE_MEMBER = void 0;
exports.getOpName = getOpName;
exports.searchOpMap = searchOpMap;
exports.createProgram = createProgram;
exports.programToString = programToString;
exports.printProgram = printProgram;
const nenv_1 = require("./nenv");
exports.OP_NOOP = 0x00;
exports.OP_TERM = 0x01;
exports.OP_JUMP = 0x02;
exports.OP_BRANCH_TRUE = 0x03;
exports.OP_BRANCH_FALSE = 0x04;
// ============= STACK OPERATIONS =============
exports.OP_LOAD_CONST_BOOL = 0x10;
exports.OP_LOAD_CONST_INT = 0x11;
exports.OP_LOAD_CONST_FLOAT = 0x12;
exports.OP_LOAD_CONST_NULL = 0x13;
exports.OP_LOAD_CONST_STRING = 0x14;
// ============= BINARY OPERATIONS =============
exports.OP_ADDi = 0x20;
exports.OP_SUBi = 0x21;
exports.OP_MULi = 0x22;
exports.OP_DIVi = 0x23;
exports.OP_MODi = 0x24;
exports.OP_POWi = 0x25;
exports.OP_ADDf = 0x26;
exports.OP_SUBf = 0x27;
exports.OP_MULf = 0x28;
exports.OP_DIVf = 0x29;
exports.OP_MODf = 0x2A;
exports.OP_POWf = 0x2B;
exports.OP_ADDs = 0x2C;
exports.OP_GREATER_THANi = 0x2D;
exports.OP_LESS_THANi = 0x2E;
exports.OP_GREATER_THAN_OR_EQUALi = 0x2F;
exports.OP_LESS_THAN_OR_EQUALi = 0x30;
exports.OP_EQUALi = 0x31;
exports.OP_NOT_EQUALi = 0x32;
exports.OP_GREATER_THANf = 0x33;
exports.OP_LESS_THANf = 0x34;
exports.OP_GREATER_THAN_OR_EQUALf = 0x35;
exports.OP_LESS_THAN_OR_EQUALf = 0x36;
exports.OP_EQUALf = 0x37;
exports.OP_NOT_EQUALf = 0x38;
exports.OP_EQUALb = 0x39;
exports.OP_NOT_EQUALb = 0x3A;
exports.OP_EQUALs = 0x3B;
exports.OP_NOT_EQUALs = 0x3C;
// ============= UNARY OPERATIONS =============
exports.OP_NEGi = 0x40;
exports.OP_NEGf = 0x41;
exports.OP_INCREMENT_LOCAL_POST = 0x42;
exports.OP_DECREMENT_LOCAL_POST = 0x43;
// ============= CONVERSION OPERATIONS =============
exports.OP_INT_TO_FLOAT = 0x50;
exports.OP_FLOAT_TO_INT = 0x51;
exports.OP_INT_TO_STRING = 0x52;
exports.OP_FLOAT_TO_STRING = 0x53;
// ============== VARIABLE OPERATIONS =============
exports.OP_LOAD_LOCAL = 0x60;
exports.OP_STORE_LOCAL = 0x61;
exports.OP_LOAD_MEMBER = 0x62;
exports.OP_STORE_MEMBER = 0x63;
exports.OP_LOAD_EXTERNAL = 0x64;
exports.OP_LOAD_ELEMENT = 0x65;
exports.OP_STORE_ELEMENT = 0x66;
exports.OP_ALLOC_STACK = 0x67;
exports.OP_POP_STACK = 0x68;
exports.OP_ALLOC_HEAP = 0x69;
exports.OP_POP_HEAP = 0x6A;
// ============== FUNCTION OPERATIONS =============
exports.OP_CALL_INTERNAL = 0x70;
exports.OP_CALL_EXTERNAL = 0x71;
const OP_NAMES = {
    0x00: 'NOOP',
    0x01: 'TERM',
    0x02: 'JUMP',
    0x03: 'BRANCH_TRUE',
    0x04: 'BRANCH_FALSE',
    0x10: 'LOAD_CONST_BOOL',
    0x11: 'LOAD_CONST_INT',
    0x12: 'LOAD_CONST_FLOAT',
    0x13: 'LOAD_CONST_NULL',
    0x14: 'LOAD_CONST_STRING',
    0x20: 'ADDi',
    0x21: 'SUBi',
    0x22: 'MULi',
    0x23: 'DIVi',
    0x24: 'MODi',
    0x25: 'POWi',
    0x26: 'ADDf',
    0x27: 'SUBf',
    0x28: 'MULf',
    0x29: 'DIVf',
    0x2A: 'MODf',
    0x2B: 'POWf',
    0x2C: 'ADDs',
    0x2D: 'GREATER_THANi',
    0x2E: 'LESS_THANi',
    0x2F: 'GREATER_THAN_OR_EQUALi',
    0x30: 'LESS_THAN_OR_EQUALi',
    0x31: 'EQUALi',
    0x32: 'NOT_EQUALi',
    0x33: 'GREATER_THANf',
    0x34: 'LESS_THANf',
    0x35: 'GREATER_THAN_OR_EQUALf',
    0x36: 'LESS_THAN_OR_EQUALf',
    0x37: 'EQUALf',
    0x38: 'NOT_EQUALf',
    0x39: 'EQUALb',
    0x3A: 'NOT_EQUALb',
    0x3B: 'EQUALs',
    0x3C: 'NOT_EQUALs',
    0x40: 'NEGi',
    0x41: 'NEGf',
    0x42: 'INCREMENT_POST',
    0x43: 'DECREMENT_POST',
    0x50: 'INT_TO_FLOAT',
    0x51: 'FLOAT_TO_INT',
    0x52: 'INT_TO_STRING',
    0x53: 'FLOAT_TO_STRING',
    0x60: 'LOAD_LOCAL',
    0x61: 'STORE_LOCAL',
    0x62: 'LOAD_MEMBER',
    0x63: 'STORE_MEMBER',
    0x64: 'LOAD_EXTERNAL',
    0x65: 'LOAD_ELEMENT',
    0x66: 'STORE_ELEMENT',
    0x67: 'ALLOC_STACK',
    0x68: 'POP_STACK',
    0x69: 'ALLOC_HEAP',
    0x6A: 'POP_HEAP',
    0x70: 'CALL_INTERNAL',
    0x71: 'CALL_EXTERNAL',
};
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
