/**
 * @file program.ts
 * @description This file contains the program object and the instructions that make up the program.
 */


/*
Naming conventions
- OP_(name)(dtype)(size)_(location)

name: The name of the operation
dtype: The data type of the operation
    - i: int
    - f: float
    - s: string
    - b: bool
    - o: object
size: The size of the operation
    - 8: 8-bit
    - 32: 32-bit
    - 64: 64-bit
location: The location of the operation
    - o: instruction operand
    - s: stack
*/

import { Nenv } from "./nenv";

let i = 0;
export const OP_NOOP                            = i++;              // No operation
export const OP_TERM                            = i++;              // Terminate the program               
export const OP_JUMP                            = i++;              // Jump to a new instruction

export const OP_BRANCH_TRUE                     = i++;              // Branch if the top of the stack is true
export const OP_BRANCH_FALSE                    = i++;              // Branch if the top of the stack is false
export const OP_BRANCH_NULL                     = i++;              // Branch if the top of the stack is null
export const OP_BRANCH_NOT_NULL                 = i++;              // Branch if the top of the stack is not null

export const OP_BRANCH_EQUAL8                   = i++;              // Branch if top of stack is equal to the second from top
export const OP_BRANCH_EQUAL32                  = i++;              // Branch if top of stack is equal to the second from top
export const OP_BRANCH_EQUAL64                  = i++;              // Branch if top of stack is equal to the second from top

export const OP_BRANCH_NOT_EQUAL8               = i++;              // Branch if top of stack is not equal to the second from top
export const OP_BRANCH_NOT_EQUAL32              = i++;              // Branch if top of stack is not equal to the second from top
export const OP_BRANCH_NOT_EQUAL64              = i++;              // Branch if top of stack is not equal to the second from top

export const OP_BRANCH_GREATER_THAN8            = i++;              // Branch if top of stack is greater than the second from top
export const OP_BRANCH_GREATER_THAN32           = i++;              // Branch if top of stack is greater than the second from top
export const OP_BRANCH_GREATER_THAN64           = i++;              // Branch if top of stack is greater than the second from top

export const OP_BRANCH_LESS_THAN8               = i++;              // Branch if top of stack is less than the second from top
export const OP_BRANCH_LESS_THAN32              = i++;              // Branch if top of stack is less than the second from top
export const OP_BRANCH_LESS_THAN64              = i++;              // Branch if top of stack is less than the second from top

export const OP_BRANCH_GREATER_THAN_OR_EQUAL8   = i++;              // Branch if top of stack is greater than or equal to the second from top
export const OP_BRANCH_GREATER_THAN_OR_EQUAL32  = i++;              // Branch if top of stack is greater than or equal to the second from top
export const OP_BRANCH_GREATER_THAN_OR_EQUAL64  = i++;              // Branch if top of stack is greater than or equal to the second from top

export const OP_BRANCH_LESS_THAN_OR_EQUAL8      = i++;              // Branch if top of stack is less than or equal to the second from top
export const OP_BRANCH_LESS_THAN_OR_EQUAL32     = i++;              // Branch if top of stack is less than or equal to the second from top
export const OP_BRANCH_LESS_THAN_OR_EQUAL64     = i++;              // Branch if top of stack is less than or equal to the second from top           

// ============= STACK OPERATIONS =============
export const OP_LOAD_LITERAL_BOOL                 = i++;            // Load a boolean literal
export const OP_LOAD_LITERAL_INT32                = i++;            // Load an integer literal
export const OP_LOAD_LITERAL_FLOAT64              = i++;            // Load a float literal
export const OP_LOAD_LITERAL_NULL                 = i++;            // Load a null literal
export const OP_LOAD_LITERAL_STRING               = i++;            // Load a string literal
export const OP_LOAD_INSTRUCTION_REFERENCE        = i++;            // Load an instruction reference
export const OP_LOAD_PTR                          = i++;            // Load a pointer
export const OP_LOAD_LITERAL_LIST                 = i++;            // Load a list literal
export const OP_LOAD_LITERAL_OBJECT               = i++;            // Load an object literal

// ============= BINARY OPERATIONS =============
export const OP_ADDi                            = i++;              // Add two integers
export const OP_SUBi                            = i++;              // Subtract two integers
export const OP_MULi                            = i++;              // Multiply two integers
export const OP_DIVi                            = i++;              // Divide two integers
export const OP_MODi                            = i++;              // Modulus of two integers                  
export const OP_POWi                            = i++;              // Exponentiation of two integers

export const OP_ADDf                            = i++;              // Add two floats
export const OP_SUBf                            = i++;              // Subtract two floats
export const OP_MULf                            = i++;              // Multiply two floats
export const OP_DIVf                            = i++;              // Divide two floats
export const OP_MODf                            = i++;              // Modulus of two floats
export const OP_POWf                            = i++;              // Exponentiation of two floats

export const OP_ADDs                            = i++;              // Add two strings
export const OP_SB_REPLACE_s                    = i++;              // Replace indexed substrings in a stringbuilder string

export const OP_GREATER_THANi                   = i++;              // Greater than comparison of two integers
export const OP_LESS_THANi                      = i++;              // Less than comparison of two integers
export const OP_GREATER_THAN_OR_EQUALi          = i++;              // Greater than or equal comparison of two integers
export const OP_LESS_THAN_OR_EQUALi             = i++;              // Less than or equal comparison of two integers
export const OP_EQUALi                          = i++;              // Equal comparison of two integers
export const OP_NOT_EQUALi                      = i++;              // Not equal comparison of two integers
export const OP_GREATER_THANf                   = i++;              // Greater than comparison of two floats
export const OP_LESS_THANf                      = i++;              // Less than comparison of two floats               
export const OP_GREATER_THAN_OR_EQUALf          = i++;              // Greater than or equal comparison of two floats
export const OP_LESS_THAN_OR_EQUALf             = i++;              // Less than or equal comparison of two floats
export const OP_EQUALf                          = i++;              // Equal comparison of two floats
export const OP_NOT_EQUALf                      = i++;              // Not equal comparison of two floats
export const OP_EQUALb                          = i++;              // Equal comparison of two booleans
export const OP_NOT_EQUALb                      = i++;              // Not equal comparison of two booleans
export const OP_EQUALs                          = i++;              // Equal comparison of two strings
export const OP_NOT_EQUALs                      = i++;              // Not equal comparison of two strings

// ============= UNARY OPERATIONS =============
export const OP_NOTb                            = i++;              // Logical NOT of a boolean
export const OP_NEGi                            = i++;              // Negation of an integer
export const OP_NEGf                            = i++;              // Negation of a float
export const OP_INCREMENT_LOCAL32               = i++;              // Increment a local variable
export const OP_DECREMENT_LOCAL32               = i++;              // Decrement a local variable

// ============= CONVERSION OPERATIONS =============
export const OP_INT_TO_FLOAT                    = i++;              // Convert an integer to a float
export const OP_FLOAT_TO_INT                    = i++;              // Convert a float to an integer
export const OP_INT_TO_STRING                   = i++;              // Convert an integer to a string
export const OP_FLOAT_TO_STRING                 = i++;              // Convert a float to a string


// ============== VARIABLE OPERATIONS =============
export const OP_LOAD_LOCAL8                     = i++;              // Load an 8-bit local variable
export const OP_LOAD_LOCAL32                    = i++;              // Load a 32-bit local variable
export const OP_LOAD_LOCAL64                    = i++;              // Load a 64-bit local variable

export const OP_STORE_LOCAL8                    = i++;              // Store an 8-bit local variable
export const OP_STORE_LOCAL32                   = i++;              // Store a 32-bit local variable
export const OP_STORE_LOCAL64                   = i++;              // Store a 64-bit local variable

export const OP_LOAD_MEMBER8                    = i++;              // Load an 8-bit member variable
export const OP_LOAD_MEMBER32                   = i++;              // Load a 32-bit member variable
export const OP_LOAD_MEMBER64                   = i++;              // Load a 64-bit member variable

export const OP_STORE_MEMBER8                   = i++;              // Store an 8-bit member variable
export const OP_STORE_MEMBER32                  = i++;              // Store a 32-bit member variable
export const OP_STORE_MEMBER64                  = i++;              // Store a 64-bit member variable

export const OP_LOAD_ELEMENT8                   = i++;              // Load an 8-bit element
export const OP_LOAD_ELEMENT32                  = i++;              // Load a 32-bit element
export const OP_LOAD_ELEMENT64                  = i++;              // Load a 64-bit element

export const OP_STORE_ELEMENT8                  = i++;              // Store an 8-bit element
export const OP_STORE_ELEMENT32                 = i++;              // Store a 32-bit element
export const OP_STORE_ELEMENT64                 = i++;              // Store a 64-bit element

export const OP_LOAD_EXTERNAL                   = i++;              // Load an external variable

export const OP_ALLOC_STACK                     = i++;              // Allocate space on the stack
export const OP_POP_STACK                       = i++;              // Pop space from the stack
export const OP_ALLOC_HEAP                      = i++;              // Allocate space on the heap
export const OP_POP_HEAP                        = i++;              // Pop space from the heap


// ============== FUNCTION OPERATIONS =============
export const OP_CALL_INTERNAL               = i++;                  // Call an internal function
export const OP_CALL_EXTERNAL               = i++;                  // Call an external function
export const OP_CALL_STACK                  = i++;                  // Call a function on the stack

export const OP_STACKPOP_VOID               = i++;                  // Return from a function
export const OP_STACKPOP_RET8               = i++;                  // Return an 8-bit value
export const OP_STACKPOP_RET32              = i++;                  // Return a 32-bit value
export const OP_STACKPOP_RET64              = i++;                  // Return a 64-bit value

export const OP_PUSH_RETURN8                = i++;                  // Push an 8-bit return value onto the stack
export const OP_PUSH_RETURN32               = i++;                  // Push a 32-bit return value onto the stack
export const OP_PUSH_RETURN64               = i++;                  // Push a 64-bit return value onto the stack




export const OP_NAMES: string[] = [
    'OP_NOOP',
    'OP_TERM',
    'OP_JUMP',
    'OP_BRANCH_TRUE',
    'OP_BRANCH_FALSE',
    'OP_BRANCH_NULL',
    'OP_BRANCH_NOT_NULL',

    'OP_BRANCH_EQUAL8',
    'OP_BRANCH_EQUAL32',
    'OP_BRANCH_EQUAL64',

    'OP_BRANCH_NOT_EQUAL8',
    'OP_BRANCH_NOT_EQUAL32',
    'OP_BRANCH_NOT_EQUAL64',

    'OP_BRANCH_GREATER_THAN8',
    'OP_BRANCH_GREATER_THAN32',
    'OP_BRANCH_GREATER_THAN64',

    'OP_BRANCH_LESS_THAN8',
    'OP_BRANCH_LESS_THAN32',
    'OP_BRANCH_LESS_THAN64',

    'OP_BRANCH_GREATER_THAN_OR_EQUAL8',
    'OP_BRANCH_GREATER_THAN_OR_EQUAL32',
    'OP_BRANCH_GREATER_THAN_OR_EQUAL64',

    'OP_BRANCH_LESS_THAN_OR_EQUAL8',
    'OP_BRANCH_LESS_THAN_OR_EQUAL32',
    'OP_BRANCH_LESS_THAN_OR_EQUAL64',

    'OP_LOAD_LITERAL_BOOL',
    'OP_LOAD_LITERAL_INT',
    'OP_LOAD_LITERAL_FLOAT',
    'OP_LOAD_LITERAL_NULL',
    'OP_LOAD_LITERAL_STRING',
    'OP_LOAD_INSTRUCTION_REFERENCE',
    'OP_LOAD_PTR',
    'OP_LOAD_LITERAL_LIST',
    'OP_LOAD_CONST_OBJECT',

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
    'OP_SB_REPLACE_s',

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

    'OP_INCREMENT_LOCAL32',
    'OP_DECREMENT_LOCAL32',
    'OP_INT_TO_FLOAT',
    'OP_FLOAT_TO_INT',
    'OP_INT_TO_STRING',
    'OP_FLOAT_TO_STRING',

    'OP_LOAD_LOCAL8',   // Also used for arguments when given a negative index
    'OP_LOAD_LOCAL32',  // Also used for arguments when given a negative index
    'OP_LOAD_LOCAL64',  // Also used for arguments when given a negative index

    'OP_STORE_LOCAL8',  // Also used for arguments when given a negative index
    'OP_STORE_LOCAL32', // Also used for arguments when given a negative index
    'OP_STORE_LOCAL64', // Also used for arguments when given a negative index

    'OP_LOAD_MEMBER8',
    'OP_LOAD_MEMBER32',
    'OP_LOAD_MEMBER64',

    'OP_STORE_MEMBER8',
    'OP_STORE_MEMBER32',
    'OP_STORE_MEMBER64',

    'OP_LOAD_ELEMENT8',
    'OP_LOAD_ELEMENT32',
    'OP_LOAD_ELEMENT64',

    'OP_STORE_ELEMENT8',
    'OP_STORE_ELEMENT32',
    'OP_STORE_ELEMENT64',

    'OP_LOAD_EXTERNAL',
    
    'OP_ALLOC_STACK',
    'OP_POP_STACK',
    'OP_ALLOC_HEAP',
    'OP_POP_HEAP',
    'OP_CALL_INTERNAL',
    'OP_CALL_EXTERNAL',
    'OP_CALL_STACK',

    'OP_RETURN',
    'OP_RETURN8',
    'OP_RETURN32',
    'OP_RETURN64',

    'OP_PUSH_RETURN8',
    'OP_PUSH_RETURN32',
    'OP_PUSH_RETURN64',
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
    'any+any': { opcode: OP_ADDi, returnDtype: 'any' },
    'any-any': { opcode: OP_SUBi, returnDtype: 'any' },
    'any*any': { opcode: OP_MULi, returnDtype: 'any' },
    'any/any': { opcode: OP_DIVi, returnDtype: 'any' },
    'any%any': { opcode: OP_MODi, returnDtype: 'any' },
    'any**any': { opcode: OP_POWi, returnDtype: 'any' },
    'any==any': { opcode: OP_EQUALi, returnDtype: 'bool' },
    'any!=any': { opcode: OP_NOT_EQUALi, returnDtype: 'bool' },
    'any>any': { opcode: OP_GREATER_THANi, returnDtype: 'bool' },
    'any<any': { opcode: OP_LESS_THANi, returnDtype: 'bool' },
    'any>=any': { opcode: OP_GREATER_THAN_OR_EQUALi, returnDtype: 'bool' },
    'any<=any': { opcode: OP_LESS_THAN_OR_EQUALi, returnDtype: 'bool' },
    'any++': { opcode: OP_INCREMENT_LOCAL32, returnDtype: 'int' },
    'any--': { opcode: OP_DECREMENT_LOCAL32, returnDtype: 'int' },
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
    'int++': { opcode: OP_INCREMENT_LOCAL32, returnDtype: 'int' },
    'int--': { opcode: OP_DECREMENT_LOCAL32, returnDtype: 'int' },
    'float++': { opcode: OP_INCREMENT_LOCAL32, returnDtype: 'float' },
    'float--': { opcode: OP_DECREMENT_LOCAL32, returnDtype: 'float' },
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
    const table = []
    for (let i = 0; i < program.instructions.length; i++) {
        let instruction = program.instructions[i];
        let operandDisplay = instruction.operand;
        if (instruction.operand != null) {
            table.push({
                opcode: getOpName(instruction.opcode),
                operand: operandDisplay
            })
        }
        else {
            table.push({
                opcode: getOpName(instruction.opcode)
            })
        }
        
        
        //console.log(`[${i}]\t${getOpName(instruction.opcode)}\t${operandDisplay}`);

    }
    console.table(table);
}