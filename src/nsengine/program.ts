import { Nenv } from "./nenv";


export const OP_NOOP                    = 0x00;
export const OP_TERM                    = 0x01;
export const OP_JUMP                    = 0x02;

export const OP_BRANCH_TRUE             = 0x03;
export const OP_BRANCH_FALSE            = 0x04;

// ============= STACK OPERATIONS =============
export const OP_LOAD_CONST_BOOL         = 0x10;
export const OP_LOAD_CONST_INT          = 0x11;
export const OP_LOAD_CONST_FLOAT        = 0x12;
export const OP_LOAD_CONST_NULL         = 0x13;
export const OP_LOAD_CONST_STRING       = 0x14;

// ============= BINARY OPERATIONS =============
export const OP_ADDi                     = 0x20;
export const OP_SUBi                     = 0x21;
export const OP_MULi                     = 0x22;
export const OP_DIVi                     = 0x23;
export const OP_MODi                     = 0x24;
export const OP_POWi                     = 0x25;
export const OP_ADDf                     = 0x26;
export const OP_SUBf                     = 0x27;
export const OP_MULf                     = 0x28;
export const OP_DIVf                     = 0x29;
export const OP_MODf                     = 0x2A;
export const OP_POWf                     = 0x2B;
export const OP_ADDs                     = 0x2C;

// ============= UNARY OPERATIONS =============
export const OP_NEGi                     = 0x30;
export const OP_NEGf                     = 0x31;

// ============= CONVERSION OPERATIONS =============
export const OP_INT_TO_FLOAT             = 0x40;
export const OP_FLOAT_TO_INT             = 0x41;
export const OP_INT_TO_STRING            = 0x42;
export const OP_FLOAT_TO_STRING          = 0x43;


// 


export interface OPResult {
    opcode: number;
    returnDtype: string;
}

export const OP_MAP: { [key: string]: OPResult } = {
    '-int': { opcode: OP_NEGi, returnDtype: 'int' },
    'int+int': { opcode: OP_ADDi, returnDtype: 'int' },
    'int-int': { opcode: OP_SUBi, returnDtype: 'int' },
    'int*int': { opcode: OP_MULi, returnDtype: 'int' },
    'int/int': { opcode: OP_DIVi, returnDtype: 'int' },
    'int%int': { opcode: OP_MODi, returnDtype: 'int' },
    'int**int': { opcode: OP_POWi, returnDtype: 'int' },
    '-float': { opcode: OP_NEGf, returnDtype: 'float' },
    'float+float': { opcode: OP_ADDf, returnDtype: 'float' },
    'float-float': { opcode: OP_SUBf, returnDtype: 'float' },
    'float*float': { opcode: OP_MULf, returnDtype: 'float' },
    'float/float': { opcode: OP_DIVf, returnDtype: 'float' },
    'float%float': { opcode: OP_MODf, returnDtype: 'float' },
    'float**float': { opcode: OP_POWf, returnDtype: 'float' },
    'string+string': { opcode: OP_ADDs, returnDtype: 'string' },
    '(float)int': { opcode: OP_INT_TO_FLOAT, returnDtype: 'float' },
    '(int)float': { opcode: OP_FLOAT_TO_INT, returnDtype: 'int' },
    '(string)int': { opcode: OP_INT_TO_STRING, returnDtype: 'string' },
    '(string)float': { opcode: OP_FLOAT_TO_STRING, returnDtype: 'string' },
};

export const IMPLICIT_CONVERSION_MAP: { [key: string]: OPResult } = {
    '(float)int': { opcode: OP_INT_TO_FLOAT, returnDtype: 'float' },
    '(string)int': { opcode: OP_INT_TO_STRING, returnDtype: 'string' },
    '(string)float': { opcode: OP_FLOAT_TO_STRING, returnDtype: 'string' },
}


/**
 * Search the OP_MAP for the given key
 * @param opKey 
 * @returns 
 */
export function searchOpMap(opKey:string): OPResult|null {
    return OP_MAP[opKey];
}


export interface Instruction {
    opcode: number;
    operand: any;
}

export interface Program {
    nenv: Nenv;
    instructions: Instruction[];
}