/**
 * @file type_int32.ts
 * @description Contains the definition for the 32-bit signed integer data type
 */
import * as prg from "../program";
import { DType, ImplicitConversion } from "./dtype";

export class Int32Type extends DType {
    constructor() {
        super(
            "int",
            ["int32"],
            "Int",
            "Number",
            "Represents a 32-bit signed integer",
            [],
            null,
            null,
            {
                "load_local": (compiler, params) => {
                    compiler.addInstruction(prg.OP_LOAD_LOCAL32, params.operand)
                    return {
                        datatype: "int",
                        lvalue: true
                    }
                },
                "load_member": (compiler, params) => {
                    compiler.addInstruction(prg.OP_LOAD_MEMBER32, params.operand)
                    return {
                        datatype: "int",
                        lvalue: true
                    }
                },
                "load_element": (compiler, params) => {
                    compiler.addInstruction(prg.OP_LOAD_ELEMENT32, params.operand)
                    return {
                        datatype: "int",
                        lvalue: true
                    }
                },
                "-int": (compiler) => {
                    compiler.addInstruction(prg.OP_NEGi);
                    return {
                        datatype: "int",
                        lvalue: false
                    }
                },
                "int+int": (compiler) => {
                    compiler.addInstruction(prg.OP_ADDi);
                    return {
                        datatype: "int",
                        lvalue: false
                    }
                },
                "int-int": (compiler) => {
                    compiler.addInstruction(prg.OP_SUBi);
                    return {
                        datatype: "int",
                        lvalue: false
                    }
                },
                "int*int": (compiler) => {
                    compiler.addInstruction(prg.OP_MULi);
                    return {
                        datatype: "int",
                        lvalue: false
                    }
                },
                "int/int": (compiler) => {
                    compiler.addInstruction(prg.OP_DIVi);
                    return {
                        datatype: "int",
                        lvalue: false
                    }
                },
                "int%int": (compiler) => {
                    compiler.addInstruction(prg.OP_MODi);
                    return {
                        datatype: "int",
                        lvalue: false
                    }
                },
                "int**int": (compiler) => {
                    compiler.addInstruction(prg.OP_POWi);
                    return {
                        datatype: "int",
                        lvalue: false
                    }
                },
                "int==int": (compiler) => {
                    compiler.addInstruction(prg.OP_EQUALi);
                    return {
                        datatype: "bool",
                        lvalue: false
                    }
                },
                "int!=int": (compiler) => {
                    compiler.addInstruction(prg.OP_NOT_EQUALi);
                    return {
                        datatype: "bool",
                        lvalue: false
                    }
                },
                "int>int": (compiler) => {
                    compiler.addInstruction(prg.OP_GREATER_THANi);
                    return {
                        datatype: "bool",
                        lvalue: false
                    }
                },
                "int<int": (compiler) => {
                    compiler.addInstruction(prg.OP_LESS_THANi);
                    return {
                        datatype: "bool",
                        lvalue: false
                    }
                },
                "int>=int": (compiler) => {
                    compiler.addInstruction(prg.OP_GREATER_THAN_OR_EQUALi);
                    return {
                        datatype: "bool",
                        lvalue: false
                    }
                },
                "int<=int": (compiler) => {
                    compiler.addInstruction(prg.OP_LESS_THAN_OR_EQUALi);
                    return {
                        datatype: "bool",
                        lvalue: false
                    }
                },
                "int=int": (compiler) => {
                    const lastInstruction = compiler.getLastInstruction();
                    
                    if (!lastInstruction) {
                        throw compiler.error("No previous instruction to increment");
                    }

                    switch (lastInstruction.opcode) {
                        case prg.OP_LOAD_LOCAL32:
                            compiler.replaceLastInstruction(prg.OP_STORE_LOCAL32);
                            break;
                        case prg.OP_LOAD_MEMBER32:
                            compiler.replaceLastInstruction(prg.OP_STORE_MEMBER32);
                            break;
                        case prg.OP_LOAD_ELEMENT32:
                            compiler.replaceLastInstruction(prg.OP_STORE_ELEMENT32);
                            break;
                        default:
                            throw compiler.error("Cannot increment previous instruction");
                    }
                    return {
                        datatype: "int",
                        lvalue: false
                    }
                },
                "int+=int": (compiler) => {
                    const lastInstruction = compiler.getLastInstruction();
                    
                    if (!lastInstruction) {
                        throw compiler.error("No previous instruction to increment");
                    }

                    switch (lastInstruction.opcode) {
                        case prg.OP_LOAD_LOCAL32:
                            compiler.replaceLastInstruction(prg.OP_INCREMENT_LOCALi32);
                            break;
                        case prg.OP_LOAD_MEMBER32:
                            compiler.replaceLastInstruction(prg.OP_INCREMENT_MEMBERi32);
                            break;
                        case prg.OP_LOAD_ELEMENT32:
                            compiler.replaceLastInstruction(prg.OP_INCREMENT_ELEMENTi32);
                            break;
                        default:
                            throw compiler.error("Cannot increment previous instruction");
                    }
                    return {
                        datatype: "int",
                        lvalue: false
                    }
                },
                "int-=int": (compiler) => {
                    const lastInstruction = compiler.getLastInstruction();
                    
                    if (!lastInstruction) {
                        throw compiler.error("No previous instruction to increment");
                    }

                    switch (lastInstruction.opcode) {
                        case prg.OP_LOAD_LOCAL32:
                            compiler.replaceLastInstruction(prg.OP_DECREMENT_LOCALi32);
                            break;
                        case prg.OP_LOAD_MEMBER32:
                            compiler.replaceLastInstruction(prg.OP_DECREMENT_MEMBERi32);
                            break;
                        case prg.OP_LOAD_ELEMENT32:
                            compiler.replaceLastInstruction(prg.OP_DECREMENT_ELEMENTi32);
                            break;
                        default:
                            throw compiler.error("Cannot increment previous instruction");
                    }
                    return {
                        datatype: "int",
                        lvalue: false
                    }
                },
                "int++": (compiler) => {
                    const lastInstruction = compiler.getLastInstruction();
                    
                    if (!lastInstruction) {
                        throw compiler.error("No previous instruction to increment");
                    }
                    prg.printInstruction(lastInstruction);
                    switch (lastInstruction.opcode) {
                        case prg.OP_LOAD_LOCAL32:
                            compiler.replaceLastInstruction(prg.OP_INCREMENT_LOCALi32);
                            break;
                        case prg.OP_LOAD_MEMBER32:
                            compiler.replaceLastInstruction(prg.OP_INCREMENT_MEMBERi32);
                            break;
                        case prg.OP_LOAD_ELEMENT32:
                            compiler.replaceLastInstruction(prg.OP_INCREMENT_ELEMENTi32);
                            break;
                        default:
                            throw compiler.error("Cannot increment previous instruction");
                    }
                    return {
                        datatype: "int",
                        lvalue: false
                    }
                },
                "int--": (compiler) => {
                    const lastInstruction = compiler.getLastInstruction();

                    if (!lastInstruction) {
                        throw compiler.error("No previous instruction to decrement");
                    }
                    switch (lastInstruction.opcode) {
                        case prg.OP_LOAD_LOCAL32:
                            compiler.replaceLastInstruction(prg.OP_DECREMENT_LOCALi32);
                            break;
                        case prg.OP_LOAD_MEMBER32:
                            compiler.replaceLastInstruction(prg.OP_DECREMENT_MEMBERi32);
                            break;
                        case prg.OP_LOAD_ELEMENT32:
                            compiler.replaceLastInstruction(prg.OP_DECREMENT_ELEMENTi32);
                            break;
                        default:
                            throw compiler.error("Cannot decrement previous instruction");
                    }
                    return {
                        datatype: "int",
                        lvalue: false
                    }
                },
                "int…int": (compiler) => {
                    compiler.addInstruction(prg.OP_RANGEi32);
                    return {
                        datatype: "list",
                        lvalue: false
                    }
                }
            }
        );
    }

    getImplicitConversion(otherDTypeName: string): ImplicitConversion | undefined | null {
        if (otherDTypeName === "string") {
            return {
                opcode: prg.OP_INT_TO_STRING,
                resultDatatype: "string"
            }
        }
        else if (otherDTypeName === "float") {
            return {
                opcode: prg.OP_INT_TO_FLOAT,
                resultDatatype: "float"
            }
        }
        return null;
    }
}