import { InterpreterStep } from "./interpreter_step";
import { Interpreter } from "../interpreter";

export class InterpretAndOr extends InterpreterStep {
    constructor(interpreter: Interpreter, nextStep: InterpreterStep | null = null) {
        super("InterpretAndOr", "Interpreting and or ", interpreter, nextStep);
    }

    execute() {
        super.execute();
        // TODO: Implement function call interpretation
        return this.nextStep?.execute();
    }
}