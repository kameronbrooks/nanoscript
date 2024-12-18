"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IMPLICIT_CONVERSION_MAP = exports.OP_MAP = exports.OP_FLOAT_TO_STRING = exports.OP_INT_TO_STRING = exports.OP_FLOAT_TO_INT = exports.OP_INT_TO_FLOAT = exports.OP_NEGf = exports.OP_NEGi = exports.OP_ADDs = exports.OP_POWf = exports.OP_MODf = exports.OP_DIVf = exports.OP_MULf = exports.OP_SUBf = exports.OP_ADDf = exports.OP_POWi = exports.OP_MODi = exports.OP_DIVi = exports.OP_MULi = exports.OP_SUBi = exports.OP_ADDi = exports.OP_LOAD_CONST_STRING = exports.OP_LOAD_CONST_NULL = exports.OP_LOAD_CONST_FLOAT = exports.OP_LOAD_CONST_INT = exports.OP_LOAD_CONST_BOOL = exports.OP_BRANCH_FALSE = exports.OP_BRANCH_TRUE = exports.OP_JUMP = exports.OP_TERM = exports.OP_NOOP = void 0;
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
// ============= UNARY OPERATIONS =============
exports.OP_NEGi = 0x30;
exports.OP_NEGf = 0x31;
// ============= CONVERSION OPERATIONS =============
exports.OP_INT_TO_FLOAT = 0x40;
exports.OP_FLOAT_TO_INT = 0x41;
exports.OP_INT_TO_STRING = 0x42;
exports.OP_FLOAT_TO_STRING = 0x43;
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
