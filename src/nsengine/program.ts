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

export const OP_GREATER_THANi            = 0x2D;
export const OP_LESS_THANi               = 0x2E;
export const OP_GREATER_THAN_OR_EQUALi   = 0x2F;
export const OP_LESS_THAN_OR_EQUALi      = 0x30;
export const OP_EQUALi                   = 0x31;
export const OP_NOT_EQUALi               = 0x32;
export const OP_GREATER_THANf            = 0x33;
export const OP_LESS_THANf               = 0x34;
export const OP_GREATER_THAN_OR_EQUALf   = 0x35;
export const OP_LESS_THAN_OR_EQUALf      = 0x36;
export const OP_EQUALf                   = 0x37;
export const OP_NOT_EQUALf               = 0x38;
export const OP_EQUALb                   = 0x39;
export const OP_NOT_EQUALb               = 0x3A;
export const OP_EQUALs                   = 0x3B;
export const OP_NOT_EQUALs               = 0x3C;

// ============= UNARY OPERATIONS =============
export const OP_NEGi                     = 0x40;
export const OP_NEGf                     = 0x41;

// ============= CONVERSION OPERATIONS =============
export const OP_INT_TO_FLOAT             = 0x50;
export const OP_FLOAT_TO_INT             = 0x51;
export const OP_INT_TO_STRING            = 0x52;
export const OP_FLOAT_TO_STRING          = 0x53;


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
    'int==int': { opcode: OP_EQUALi, returnDtype: 'bool' },
    'int!=int': { opcode: OP_NOT_EQUALi, returnDtype: 'bool' },
    'int>int': { opcode: OP_GREATER_THANi, returnDtype: 'bool' },
    'int<int': { opcode: OP_LESS_THANi, returnDtype: 'bool' },
    'int>=int': { opcode: OP_GREATER_THAN_OR_EQUALi, returnDtype: 'bool' },
    'int<=int': { opcode: OP_LESS_THAN_OR_EQUALi, returnDtype: 'bool' },
    'float==float': { opcode: OP_EQUALf, returnDtype: 'bool' },
    'float!=float': { opcode: OP_NOT_EQUALf, returnDtype: 'bool' },
    'float>float': { opcode: OP_GREATER_THANf, returnDtype: 'bool' },
    'float<float': { opcode: OP_LESS_THANf, returnDtype: 'bool' },
    'float>=float': { opcode: OP_GREATER_THAN_OR_EQUALf, returnDtype: 'bool' },
    'float<=float': { opcode: OP_LESS_THAN_OR_EQUALf, returnDtype: 'bool' },
    'bool==bool': { opcode: OP_EQUALb, returnDtype: 'bool' },
    'bool!=bool': { opcode: OP_NOT_EQUALb, returnDtype: 'bool' },
    'string==string': { opcode: OP_EQUALs, returnDtype: 'bool' },
    'string!=string': { opcode: OP_NOT_EQUALs, returnDtype: 'bool' },
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
    engineVersion: string;
    nenv: Nenv;
    instructions: Instruction[];
}