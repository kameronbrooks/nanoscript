import { InterpreterStep } from "./interpreter_step";
import { Interpreter } from "../interpreter";

export class InterpretPreUnary extends InterpreterStep {
    constructor(interpreter: Interpreter, nextStep: InterpreterStep | null = null) {
        super("InterpretPreUnary", "Interpreting a pre-unary operator", interpreter, nextStep);
    }
    
    execute() {
        super.execute();
        // TODO: Implement function call interpretation
        return this.nextStep?.execute();
    }
}