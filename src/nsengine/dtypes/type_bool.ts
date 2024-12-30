/**
 * @file type_bool.ts
 * @description Contains the definition for the Boolean data type
 */
import * as prg from "../program";
import { DType } from "./dtype";

export class BoolType extends DType {
    constructor() {
        super(
            "bool",
            undefined,
            "Boolean",
            "Boolean",
            "Represents a true or false value",
            [],
            null,
            null,
            {
                "load_local": (compiler, params) => {
                    compiler.addInstruction(prg.OP_LOAD_LOCAL8, params.operand)
                    return {
                        datatype: "bool",
                        lvalue: true
                    }
                },
                "load_member": (compiler, params) => {
                    compiler.addInstruction(prg.OP_LOAD_MEMBER8, params.operand)
                    return {
                        datatype: "bool",
                        lvalue: true
                    }
                },
                "load_element": (compiler, params) => {
                    compiler.addInstruction(prg.OP_LOAD_ELEMENT8, params.operand)
                    return {
                        datatype: "bool",
                        lvalue: true
                    }
                },
                "bool+bool": (compiler) => {
                    throw new Error("Cannot add two boolean values");
                },
                "bool-bool": (compiler) => {
                    throw new Error("Cannot subtract two boolean values");
                },
                "bool*bool": (compiler) => {
                    throw new Error("Cannot multiply two boolean values");
                },
                "bool/bool": (compiler) => {
                    throw new Error("Cannot divide two boolean values");
                },
                "bool%bool": (compiler) => {
                    throw new Error("Cannot modulo two boolean values");
                },
                "bool**bool": (compiler) => {
                    throw new Error("Cannot exponentiate two boolean values");
                },
                "bool==bool": (compiler) => {
                    compiler.addInstruction(prg.OP_EQUALb);
                    return {
                        datatype: "bool",
                        lvalue: false
                    }
                },
                "bool!=bool": (compiler) => {
                    compiler.addInstruction(prg.OP_NOT_EQUALb);
                    return {
                        datatype: "bool",
                        lvalue: false
                    }
                },
                "bool&&bool": (compiler) => {
                    compiler.addInstruction(prg.OP_ANDb);
                    return {
                        datatype: "bool",
                        lvalue: false
                    }
                },
                "bool||bool": (compiler) => {
                    compiler.addInstruction(prg.OP_ORb);
                    return {
                        datatype: "bool",
                        lvalue: false
                    }
                },
                "!bool": (compiler) => {
                    compiler.addInstruction(prg.OP_NOTb);
                    return {
                        datatype: "bool",
                        lvalue: false
                    }
                },
            }
        );
    }
}