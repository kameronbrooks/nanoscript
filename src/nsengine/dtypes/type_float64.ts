/**
 * @file type_float64.ts
 * @description Contains the definition for the 64-bit floating point number data type
 */
import * as prg from "../program";
import { DType, ImplicitConversion } from "./dtype";

export class Float64Type extends DType {
    constructor() {
        super(
            "float",
            ["float64"],
            "Float",
            "Number",
            "Represents a 64-bit floating point number",
            [],
            null,
            null,
            {
                "load_local": (compiler, params) => {
                    compiler.addInstruction(prg.OP_LOAD_LOCAL64, params.operand)
                    return {
                        datatype: "float",
                        lvalue: true
                    }
                },
                "load_member": (compiler, params) => {
                    compiler.addInstruction(prg.OP_LOAD_MEMBER64, params.operand)
                    return {
                        datatype: "float",
                        lvalue: true
                    }
                },
                "load_element": (compiler, params) => {
                    compiler.addInstruction(prg.OP_LOAD_ELEMENT64, params.operand)
                    return {
                        datatype: "float",
                        lvalue: true
                    }
                },
                "float+float": (compiler) => {
                    compiler.addInstruction(prg.OP_ADDf);
                    return {
                        datatype: "float",
                        lvalue: false
                    }
                },
                "float-float": (compiler) => {
                    compiler.addInstruction(prg.OP_SUBf);
                    return {
                        datatype: "float",
                        lvalue: false
                    }
                },
                "float*float": (compiler) => {
                    compiler.addInstruction(prg.OP_MULf);
                    return {
                        datatype: "float",
                        lvalue: false
                    }
                },
                "float/float": (compiler) => {
                    compiler.addInstruction(prg.OP_DIVf);
                    return {
                        datatype: "float",
                        lvalue: false
                    }
                },
                "float%float": (compiler) => {
                    compiler.addInstruction(prg.OP_MODf);
                    return {
                        datatype: "float",
                        lvalue: false
                    }
                },
                "float**float": (compiler) => {
                    compiler.addInstruction(prg.OP_POWf);
                    return {
                        datatype: "float",
                        lvalue: false
                    }
                },
                "float==float": (compiler) => {
                    compiler.addInstruction(prg.OP_EQUALf);
                    return {
                        datatype: "bool",
                        lvalue: false
                    }
                },
                "float!=float": (compiler) => {
                    compiler.addInstruction(prg.OP_NOT_EQUALf);
                    return {
                        datatype: "bool",
                        lvalue: false
                    }
                },
                "float>float": (compiler) => {
                    compiler.addInstruction(prg.OP_GREATER_THANf);
                    return {
                        datatype: "bool",
                        lvalue: false
                    }
                },
                "float<float": (compiler) => {
                    compiler.addInstruction(prg.OP_LESS_THANf);
                    return {
                        datatype: "bool",
                        lvalue: false
                    }
                },
                "float>=float": (compiler) => {
                    compiler.addInstruction(prg.OP_GREATER_THAN_OR_EQUALf);
                    return {
                        datatype: "bool",
                        lvalue: false
                    }
                },
                "float<=float": (compiler) => {
                    compiler.addInstruction(prg.OP_LESS_THAN_OR_EQUALf);
                    return {
                        datatype: "bool",
                        lvalue: false
                    }
                },
                "float=float": (compiler) => {
                    const lastInstruction = compiler.getLastInstruction();

                    if (!lastInstruction) {
                        throw compiler.error("No previous instruction to increment");
                    }
                    prg.printInstruction(lastInstruction);
                    switch (lastInstruction.opcode) {
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
                        datatype: "float",
                        lvalue: false
                    }
                },
                "float+=float": (compiler) => {
                    const lastInstruction = compiler.getLastInstruction();

                    if (!lastInstruction) {
                        throw compiler.error("No previous instruction to increment");
                    }
                    prg.printInstruction(lastInstruction);
                    switch (lastInstruction.opcode) {
                        case prg.OP_LOAD_LOCAL32:
                            compiler.replaceLastInstruction(prg.OP_INCREMENT_LOCALf64);
                            break;
                        case prg.OP_LOAD_MEMBER32:
                            compiler.replaceLastInstruction(prg.OP_INCREMENT_MEMBERf64);
                            break;
                        case prg.OP_LOAD_ELEMENT32:
                            compiler.replaceLastInstruction(prg.OP_INCREMENT_ELEMENTf64);
                            break;
                        default:
                            throw compiler.error("Cannot increment previous instruction");
                    }
                    return {
                        datatype: "float",
                        lvalue: false
                    }
                },
                "float-=float": (compiler) => {
                    const lastInstruction = compiler.getLastInstruction();

                    if (!lastInstruction) {
                        throw compiler.error("No previous instruction to increment");
                    }
                    prg.printInstruction(lastInstruction);
                    switch (lastInstruction.opcode) {
                        case prg.OP_LOAD_LOCAL32:
                            compiler.replaceLastInstruction(prg.OP_DECREMENT_LOCALf64);
                            break;
                        case prg.OP_LOAD_MEMBER32:
                            compiler.replaceLastInstruction(prg.OP_DECREMENT_MEMBERf64);
                            break;
                        case prg.OP_LOAD_ELEMENT32:
                            compiler.replaceLastInstruction(prg.OP_DECREMENT_ELEMENTf64);
                            break;
                        default:
                            throw compiler.error("Cannot increment previous instruction");
                    }
                    return {
                        datatype: "float",
                        lvalue: false
                    }
                },
                "-float": (compiler) => {
                    compiler.addInstruction(prg.OP_NEGf);
                    return {
                        datatype: "float",
                        lvalue: false
                    }
                },
                "float++": (compiler) => {
                    const lastInstruction = compiler.getLastInstruction();

                    if (!lastInstruction) {
                        throw compiler.error("No previous instruction to increment");
                    }
                    prg.printInstruction(lastInstruction);
                    switch (lastInstruction.opcode) {
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
                        datatype: "int",
                        lvalue: false
                    }
                },
                "float--": (compiler) => {
                    const lastInstruction = compiler.getLastInstruction();

                    if (!lastInstruction) {
                        throw compiler.error("No previous instruction to decrement");
                    }
                    switch (lastInstruction.opcode) {
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

    getImplicitConversion(otherDTypeName: string): ImplicitConversion | undefined | null {
        if (otherDTypeName === "string") {
            return {
                opcode: prg.OP_FLOAT_TO_STRING,
                resultDatatype: "string"
            }
        }
        return null;
    }
}