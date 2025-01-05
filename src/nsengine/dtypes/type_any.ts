/**
 * @file type_any.ts
 * @description Contains the definition for the Any data type
 */
import * as prg from "../program";
import { DType } from "./dtype";

export class AnyType extends DType {
    constructor() {
        super(
            "any",
            undefined,
            "Any",
            "Any",
            "Can represent any data type if a more specific type is not known",
            [],
            null,
            null,
            {
                "load_local": (compiler, params) => {
                    compiler.addInstruction(prg.OP_LOAD_LOCAL64, params.operand)
                    return {
                        datatype: "any",
                        lvalue: true
                    }
                },
                "load_member": (compiler, params) => {
                    compiler.addInstruction(prg.OP_LOAD_MEMBER64, params.operand)
                    return {
                        datatype: "any",
                        lvalue: true
                    }
                },
                "load_element": (compiler, params) => {
                    compiler.addInstruction(prg.OP_LOAD_ELEMENT64, params.operand)
                    return {
                        datatype: "any",
                        lvalue: true
                    }
                },
                "any+any": (compiler) => {
                    compiler.addInstruction(prg.OP_ADDi);
                    return {
                        datatype: "any",
                        lvalue: false
                    };
                },
                "any-any": (compiler) => {
                    compiler.addInstruction(prg.OP_SUBi);
                    return {
                        datatype: "any",
                        lvalue: false
                    }
                },
                "any*any": (compiler) => {
                    compiler.addInstruction(prg.OP_MULi);
                    return {
                        datatype: "any",
                        lvalue: false
                    }
                },
                "any/any": (compiler) => {
                    compiler.addInstruction(prg.OP_DIVi);
                    return {
                        datatype: "any",
                        lvalue: false
                    }
                },
                "any%any": (compiler) => {
                    compiler.addInstruction(prg.OP_MODi);
                    return {
                        datatype: "any",
                        lvalue: false
                    }
                },
                "any**any": (compiler) => {
                    compiler.addInstruction(prg.OP_POWi);
                    return {
                        datatype: "any",
                        lvalue: false
                    }
                },
                "any=any": (compiler) => {
                    const lastInstruction = compiler.getLastInstruction();

                    if (!lastInstruction) {
                        throw compiler.error("No previous instruction to increment");
                    }
                    prg.printInstruction(lastInstruction);
                    switch (lastInstruction.opcode) {
                        case prg.OP_LOAD_LOCAL8:
                            compiler.replaceLastInstruction(prg.OP_STORE_LOCAL8);
                            break;
                        case prg.OP_LOAD_MEMBER8:
                            compiler.replaceLastInstruction(prg.OP_STORE_MEMBER8);
                            break;
                        case prg.OP_LOAD_ELEMENT8:
                            compiler.replaceLastInstruction(prg.OP_STORE_ELEMENT8);
                            break;
                        case prg.OP_LOAD_LOCAL32:
                            compiler.replaceLastInstruction(prg.OP_STORE_LOCAL32);
                            break;
                        case prg.OP_LOAD_MEMBER32:
                            compiler.replaceLastInstruction(prg.OP_STORE_MEMBER32);
                            break;
                        case prg.OP_LOAD_ELEMENT32:
                            compiler.replaceLastInstruction(prg.OP_STORE_ELEMENT32);
                            break;
                        case prg.OP_LOAD_LOCAL64:
                            compiler.replaceLastInstruction(prg.OP_STORE_LOCAL64);
                            break;
                        case prg.OP_LOAD_MEMBER64:
                            compiler.replaceLastInstruction(prg.OP_STORE_MEMBER64);
                            break;
                        case prg.OP_LOAD_ELEMENT64:
                            compiler.replaceLastInstruction(prg.OP_STORE_ELEMENT64);
                            break;
                        
                        default:
                            throw compiler.error("Cannot increment previous instruction");
                    }
                    return {
                        datatype: "any",
                        lvalue: false
                    }
                },
                "any+=any": (compiler) => {
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
                        case prg.OP_LOAD_LOCAL64:
                            compiler.replaceLastInstruction(prg.OP_INCREMENT_LOCALf64);
                            break;
                        case prg.OP_LOAD_MEMBER64:
                            compiler.replaceLastInstruction(prg.OP_INCREMENT_MEMBERf64);
                            break;
                        case prg.OP_LOAD_ELEMENT64:
                            compiler.replaceLastInstruction(prg.OP_INCREMENT_ELEMENTf64);
                            break;
                        default:
                            throw compiler.error("Cannot increment previous instruction");
                    }
                    return {
                        datatype: "any",
                        lvalue: false
                    }
                },
                "any-=any": (compiler) => {
                    const lastInstruction = compiler.getLastInstruction();

                    if (!lastInstruction) {
                        throw compiler.error("No previous instruction to increment");
                    }
                    prg.printInstruction(lastInstruction);
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
                        case prg.OP_LOAD_LOCAL64:
                            compiler.replaceLastInstruction(prg.OP_DECREMENT_LOCALf64);
                            break;
                        case prg.OP_LOAD_MEMBER64:
                            compiler.replaceLastInstruction(prg.OP_DECREMENT_MEMBERf64);
                            break;
                        case prg.OP_LOAD_ELEMENT64:
                            compiler.replaceLastInstruction(prg.OP_DECREMENT_ELEMENTf64);
                            break;
                        default:
                            throw compiler.error("Cannot increment previous instruction");
                    }
                    return {
                        datatype: "any",
                        lvalue: false
                    }
                },
                "any==any": (compiler) => {
                    compiler.addInstruction(prg.OP_EQUALi);
                    return {
                        datatype: "bool",
                        lvalue: false
                    }
                },
                "any!=any": (compiler) => {
                    compiler.addInstruction(prg.OP_NOT_EQUALi);
                    return {
                        datatype: "bool",
                        lvalue: false
                    }
                },
                "any>any": (compiler) => {
                    compiler.addInstruction(prg.OP_GREATER_THANi);
                    return {
                        datatype: "bool",
                        lvalue: false
                    }
                },
                "any<any": (compiler) => {
                    compiler.addInstruction(prg.OP_LESS_THANi);
                    return {
                        datatype: "bool",
                        lvalue: false
                    }
                },
                "any>=any": (compiler) => {
                    compiler.addInstruction(prg.OP_GREATER_THAN_OR_EQUALi);
                    return {
                        datatype: "bool",
                        lvalue: false
                    }
                },
                "any<=any": (compiler) => {
                    compiler.addInstruction(prg.OP_LESS_THAN_OR_EQUALi);
                    return {
                        datatype: "bool",
                        lvalue: false
                    }
                },
                "any++": (compiler) => {
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
                "any--": (compiler) => {
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
                }
            }
        );
    }
}
