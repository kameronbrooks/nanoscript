
import * as prg from "../program";
import { DType } from "./dtype";

export class SetType extends DType {
    constructor() {
        super(
            "set",
            undefined,
            "Set",
            "Set",
            "Represents a set of values",
            [],
            null,
            null,
            {

            }
        );
        
        this.canBeIndexed = false;
        this.canBeIterated = true;
    }
}