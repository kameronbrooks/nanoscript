import { InterpreterStep } from "./interpreter_step";
import { Interpreter } from "../interpreter";

export class InterpretIdentifier extends InterpreterStep {
    constructor(interpreter: Interpreter, nextStep: InterpreterStep | null = null) {
        super("InterpretIdentifier", "Interpreting an identifier", interpreter, nextStep);
    }

    execute() {
        super.execute();
        if (this.interpreter.match("IDENTIFIER")) {
            return { type: "Identifier", value: this.interpreter.previous().value };
        }
        else {
            return this.nextStep?.execute();
        }
    }
}