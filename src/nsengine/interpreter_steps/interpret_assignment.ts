import { InterpreterStep } from "./interpreter_step";
import { Interpreter } from "../interpreter";

export class InterpretAssignment extends InterpreterStep {
    constructor(interpreter: Interpreter, nextStep: InterpreterStep | null = null) {
        super("InterpretAssignment", "Interpreting an assignment operator", interpreter, nextStep);
    }
    
    execute() {
        super.execute();
        // TODO: Implement function call interpretation
        return this.nextStep?.execute();
    }
}