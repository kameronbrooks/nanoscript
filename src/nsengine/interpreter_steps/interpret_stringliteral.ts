import { InterpreterStep } from "./interpreter_step";
import { Interpreter } from "../interpreter";
import { TokenType } from "../tokenizer";

export class InterpretStringLiteral extends InterpreterStep {
    constructor(interpreter: Interpreter, nextStep: InterpreterStep | null = null) {
        super("InterpretPrimative", "Interpreting a primative value", interpreter, nextStep);
    }

    execute() {
        this.log();
        if (this.interpreter.match("STRINGLITERAL")) {
            return { type: "String", value: this.interpreter.previous().value };
        }
        else {
            return this.nextStep?.execute();
        }
    }
}