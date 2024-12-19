import { InterpreterStep } from "./interpreter_step";
import { Interpreter } from "../interpreter";
import { ASTNode } from "../ast";

export class InterpretIdentifier extends InterpreterStep {
    constructor(interpreter: Interpreter, nextStep: InterpreterStep | null = null) {
        super("InterpretIdentifier", "Interpreting an identifier", interpreter, nextStep);
    }

    execute() {
        if(this.verboseMode) this.log();
        if (this.interpreter.match("IDENTIFIER")) {
            return { type: "Identifier", value: this.interpreter.previous().value } as ASTNode;
        }
        else {
            return this.nextStep?.execute();
        }
    }
}