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
export const OP_INCREMENT_LOCAL_POST           = 0x42;
export const OP_DECREMENT_LOCAL_POST           = 0x43;

// ============= CONVERSION OPERATIONS =============
export const OP_INT_TO_FLOAT             = 0x50;
export const OP_FLOAT_TO_INT             = 0x51;
export const OP_INT_TO_STRING            = 0x52;
export const OP_FLOAT_TO_STRING          = 0x53;


// ============== VARIABLE OPERATIONS =============
export const OP_LOAD_LOCAL                  = 0x60;
export const OP_STORE_LOCAL                 = 0x61;

export const OP_LOAD_MEMBER                 = 0x62;
export const OP_STORE_MEMBER                = 0x63;

export const OP_LOAD_EXTERNAL               = 0x64;

export const OP_LOAD_ELEMENT                = 0x65;
export const OP_STORE_ELEMENT               = 0x66;

export const OP_ALLOC_STACK                    = 0x67;
export const OP_POP_STACK                     = 0x68;
export const OP_ALLOC_HEAP                     = 0x69;
export const OP_POP_HEAP                      = 0x6A;


// ============== FUNCTION OPERATIONS =============
export const OP_CALL_INTERNAL               = 0x70;
export const OP_CALL_EXTERNAL               = 0x71;


const OP_NAMES: { [key: number]: string } = {
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

export function getOpName(opcode: number): string {
    return OP_NAMES[opcode];
}


export interface OPResult {
    opcode: number;
    returnDtype: string;
}

export const OP_MAP: { [key: string]: OPResult } = {
    '-int': { opcode: OP_NEGi, returnDtype: 'int' },
    // This is for the any case (kind of a hack)
    'any+any': { opcode: OP_ADDi, returnDtype: 'int' },
    'any-any': { opcode: OP_SUBi, returnDtype: 'int' },
    'any*any': { opcode: OP_MULi, returnDtype: 'int' },
    'any/any': { opcode: OP_DIVi, returnDtype: 'int' },
    'any%any': { opcode: OP_MODi, returnDtype: 'int' },
    'any==any': { opcode: OP_EQUALi, returnDtype: 'bool' },
    'any!=any': { opcode: OP_NOT_EQUALi, returnDtype: 'bool' },
    'any>any': { opcode: OP_GREATER_THANi, returnDtype: 'bool' },
    'any<any': { opcode: OP_LESS_THANi, returnDtype: 'bool' },
    'any>=any': { opcode: OP_GREATER_THAN_OR_EQUALi, returnDtype: 'bool' },
    'any<=any': { opcode: OP_LESS_THAN_OR_EQUALi, returnDtype: 'bool' },
    'any++': { opcode: OP_INCREMENT_LOCAL_POST, returnDtype: 'int' },
    'any--': { opcode: OP_DECREMENT_LOCAL_POST, returnDtype: 'int' },
    // Int
    'int+int': { opcode: OP_ADDi, returnDtype: 'int' },
    'int-int': { opcode: OP_SUBi, returnDtype: 'int' },
    'int*int': { opcode: OP_MULi, returnDtype: 'int' },
    'int/int': { opcode: OP_DIVi, returnDtype: 'int' },
    'int%int': { opcode: OP_MODi, returnDtype: 'int' },
    'int**int': { opcode: OP_POWi, returnDtype: 'int' },
    // Float
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
    'int++': { opcode: OP_INCREMENT_LOCAL_POST, returnDtype: 'int' },
    'int--': { opcode: OP_DECREMENT_LOCAL_POST, returnDtype: 'int' },
    'float++': { opcode: OP_INCREMENT_LOCAL_POST, returnDtype: 'float' },
    'float--': { opcode: OP_DECREMENT_LOCAL_POST, returnDtype: 'float' },
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

/**
 * A constructor for the Program object
 * @param engineVersion 
 * @param instructions 
 * @param nenv 
 * @returns 
 */
export function createProgram(engineVersion: string, instructions?: Instruction[], nenv?: Nenv, ): Program {
    return {
        engineVersion,
        nenv: nenv || new Nenv(),
        instructions: instructions || [],
    };
}

/**
 * Return the string representation of the program
 * @param program 
 * @returns 
 */
export function programToString(program: Program): string {
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
export function printProgram(program: Program): void {
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