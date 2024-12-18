"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IMPLICIT_CONVERSION_MAP = exports.OP_MAP = exports.OP_FLOAT_TO_STRING = exports.OP_INT_TO_STRING = exports.OP_FLOAT_TO_INT = exports.OP_INT_TO_FLOAT = exports.OP_NEGf = exports.OP_NEGi = exports.OP_NOT_EQUALs = exports.OP_EQUALs = exports.OP_NOT_EQUALb = exports.OP_EQUALb = exports.OP_NOT_EQUALf = exports.OP_EQUALf = exports.OP_LESS_THAN_OR_EQUALf = exports.OP_GREATER_THAN_OR_EQUALf = exports.OP_LESS_THANf = exports.OP_GREATER_THANf = exports.OP_NOT_EQUALi = exports.OP_EQUALi = exports.OP_LESS_THAN_OR_EQUALi = exports.OP_GREATER_THAN_OR_EQUALi = exports.OP_LESS_THANi = exports.OP_GREATER_THANi = exports.OP_ADDs = exports.OP_POWf = exports.OP_MODf = exports.OP_DIVf = exports.OP_MULf = exports.OP_SUBf = exports.OP_ADDf = exports.OP_POWi = exports.OP_MODi = exports.OP_DIVi = exports.OP_MULi = exports.OP_SUBi = exports.OP_ADDi = exports.OP_LOAD_CONST_STRING = exports.OP_LOAD_CONST_NULL = exports.OP_LOAD_CONST_FLOAT = exports.OP_LOAD_CONST_INT = exports.OP_LOAD_CONST_BOOL = exports.OP_BRANCH_FALSE = exports.OP_BRANCH_TRUE = exports.OP_JUMP = exports.OP_TERM = exports.OP_NOOP = void 0;
exports.searchOpMap = searchOpMap;
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
// ============= CONVERSION OPERATIONS =============
exports.OP_INT_TO_FLOAT = 0x50;
exports.OP_FLOAT_TO_INT = 0x51;
exports.OP_INT_TO_STRING = 0x52;
exports.OP_FLOAT_TO_STRING = 0x53;
exports.OP_MAP = {
    '-int': { opcode: exports.OP_NEGi, returnDtype: 'int' },
    'int+int': { opcode: exports.OP_ADDi, returnDtype: 'int' },
    'int-int': { opcode: exports.OP_SUBi, returnDtype: 'int' },
    'int*int': { opcode: exports.OP_MULi, returnDtype: 'int' },
    'int/int': { opcode: exports.OP_DIVi, returnDtype: 'int' },
    'int%int': { opcode: exports.OP_MODi, returnDtype: 'int' },
    'int**int': { opcode: exports.OP_POWi, returnDtype: 'int' },
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
