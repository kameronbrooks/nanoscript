import * as prg from "../program";
import { DType } from "./dtype";

export class ObjectType extends DType {
    constructor() {
        super(
            "object",
            ['dict'],
            "Object",
            "Object",
            "Represents a generic object",
            [],
            null,
            null,
            {
                "object==object": (compiler) => {
                    compiler.addInstruction(prg.OP_EQUALo);
                    return {
                        datatype: "bool",
                        lvalue: false
                    }
                },
                "object!=object": (compiler) => {
                    compiler.addInstruction(prg.OP_NOT_EQUALo);
                    return {
                        datatype: "bool",
                        lvalue: false
                    }
                },
            }
        );

        this.canBeIndexed = true;
        this.canBeIterated = true;
    }
}