import * as prg from "../program";
import { DType } from "./dtype";

export class StringType extends DType {
    constructor() {
        super(
            "string",
            undefined,
            "String",
            "String",
            "Represents a string of characters",
            [],
            null,
            null,
            {
                "string+string": (compiler) => {
                    compiler.addInstruction(prg.OP_ADDs);
                    return {
                        datatype: "string",
                        lvalue: false
                    }
                },
                "string==string": (compiler) => {
                    compiler.addInstruction(prg.OP_EQUALs);
                    return {
                        datatype: "bool",
                        lvalue: false
                    }
                },
                "string!=string": (compiler) => {
                    compiler.addInstruction(prg.OP_NOT_EQUALs);
                    return {
                        datatype: "bool",
                        lvalue: false
                    }
                },
            }
        );
    }
}