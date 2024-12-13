import { InterpreterStep } from "./interpreter_step";
import { Interpreter } from "../interpreter";

export class InterpretPowRoot extends InterpreterStep {
    constructor(interpreter: Interpreter, nextStep: InterpreterStep | null = null) {
        super("InterpretPowRoot", "Interpreting power and sqrt", interpreter, nextStep);
    }
    
    execute() {
        super.execute();
        // TODO: Implement function call interpretation
        return this.nextStep?.execute();
    }
}