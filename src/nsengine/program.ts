import { Nenv } from "./nenv";

let i = 0;
export const OP_NOOP                    = i++;
export const OP_TERM                    = i++;
export const OP_JUMP                    = i++;

export const OP_BRANCH_TRUE             = i++;
export const OP_BRANCH_FALSE            = i++;
export const OP_BRANCH_NULL             = i++;
export const OP_BRANCH_NOT_NULL         = i++;
export const OP_BRANCH_EQUAL            = i++;
export const OP_BRANCH_NOT_EQUAL        = i++;
export const OP_BRANCH_GREATER_THAN     = i++;
export const OP_BRANCH_LESS_THAN        = i++;
export const OP_BRANCH_GREATER_THAN_OR_EQUAL = i++;
export const OP_BRANCH_LESS_THAN_OR_EQUAL = i++;

// ============= STACK OPERATIONS =============
export const OP_LOAD_CONST_BOOL         = i++;
export const OP_LOAD_CONST_INT          = i++;
export const OP_LOAD_CONST_FLOAT        = i++;
export const OP_LOAD_CONST_NULL         = i++;
export const OP_LOAD_CONST_STRING       = i++;

// ============= BINARY OPERATIONS =============
export const OP_ADDi                     = i++;
export const OP_SUBi                     = i++;
export const OP_MULi                     = i++;
export const OP_DIVi                     = i++;
export const OP_MODi                     = i++;
export const OP_POWi                     = i++;
export const OP_ADDf                     = i++;
export const OP_SUBf                     = i++;
export const OP_MULf                     = i++;
export const OP_DIVf                     = i++;
export const OP_MODf                     = i++;
export const OP_POWf                     = i++;
export const OP_ADDs                     = i++;

export const OP_GREATER_THANi            = i++;
export const OP_LESS_THANi               = i++;
export const OP_GREATER_THAN_OR_EQUALi   = i++;
export const OP_LESS_THAN_OR_EQUALi      = i++;
export const OP_EQUALi                   = i++;
export const OP_NOT_EQUALi               = i++;
export const OP_GREATER_THANf            = i++;
export const OP_LESS_THANf               = i++;
export const OP_GREATER_THAN_OR_EQUALf   = i++;
export const OP_LESS_THAN_OR_EQUALf      = i++;
export const OP_EQUALf                   = i++;
export const OP_NOT_EQUALf               = i++;
export const OP_EQUALb                   = i++;
export const OP_NOT_EQUALb               = i++;
export const OP_EQUALs                   = i++;
export const OP_NOT_EQUALs               = i++;

// ============= UNARY OPERATIONS =============
export const OP_NOTb                     = i++; 
export const OP_NEGi                     = i++;
export const OP_NEGf                     = i++;
export const OP_INCREMENT_LOCAL_POST           = i++;
export const OP_DECREMENT_LOCAL_POST           = i++;

// ============= CONVERSION OPERATIONS =============
export const OP_INT_TO_FLOAT             = i++;
export const OP_FLOAT_TO_INT             = i++;
export const OP_INT_TO_STRING            = i++;
export const OP_FLOAT_TO_STRING          = i++;


// ============== VARIABLE OPERATIONS =============
export const OP_LOAD_LOCAL                  = i++;
export const OP_STORE_LOCAL                 = i++;

export const OP_LOAD_MEMBER                 = i++;
export const OP_STORE_MEMBER                = i++;

export const OP_LOAD_EXTERNAL               = i++;

export const OP_LOAD_ELEMENT                = i++;
export const OP_STORE_ELEMENT               = i++;

export const OP_ALLOC_STACK                    = i++;
export const OP_POP_STACK                     = i++;
export const OP_ALLOC_HEAP                     = i++;
export const OP_POP_HEAP                      = i++;


// ============== FUNCTION OPERATIONS =============
export const OP_CALL_INTERNAL               = i++;
export const OP_CALL_EXTERNAL               = i++;


const OP_NAMES: string[] = [
    'OP_NOOP',
    'OP_TERM',
    'OP_JUMP',
    'OP_BRANCH_TRUE',
    'OP_BRANCH_FALSE',
    'OP_BRANCH_NULL',
    'OP_BRANCH_NOT_NULL',
    'OP_BRANCH_EQUAL',
    'OP_BRANCH_NOT_EQUAL',
    'OP_BRANCH_GREATER_THAN',
    'OP_BRANCH_LESS_THAN',
    'OP_BRANCH_GREATER_THAN_OR_EQUAL',
    'OP_BRANCH_LESS_THAN_OR_EQUAL',
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
    'OP_NOTb',
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
    '!bool': { opcode: OP_NOTb, returnDtype: 'bool' },
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

/**
 * The fundamental unit of a program
 */
export interface Instruction {
    opcode: number;
    operand: any;
    index?: number;
    label?: string;
}

/**
 * Return the string representation of the instruction
 * @param instruction 
 * @returns 
 */
export function printInstruction(instruction: Instruction): string {
    return `${getOpName(instruction.opcode)} ${instruction.operand}`;
}

/**
 * Removes the extra metadata from the instruction leaving only the opcode and operand
 * @param instruction 
 * @returns 
 */
export function removeInstructionMetadata(instruction: Instruction): Instruction {
    return {
        opcode: instruction.opcode,
        operand: instruction.operand,
    };
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