import { InterpreterStep } from "./interpreter_step";
import { Interpreter } from "../interpreter";

export class InterpretFunctionCall extends InterpreterStep {
    constructor(interpreter: Interpreter, nextStep: InterpreterStep | null = null) {
        super("InterpretFunctionCall", "Interpreting a function call", interpreter, nextStep);
    }

    execute() {
        this.log();
        // TODO: Implement function call interpretation
        return this.nextStep?.execute();
    }
}