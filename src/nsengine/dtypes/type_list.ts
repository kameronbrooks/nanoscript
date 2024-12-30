
import * as prg from "../program";
import { DType } from "./dtype";

export class ListType extends DType {
    constructor() {
        super(
            "list",
            undefined,
            "List",
            "List",
            "Represents a list of values",
            [],
            null,
            null,
            {

            }
        );
        
        this.canBeIndexed = true;
        this.canBeIterated = true;
    }
}