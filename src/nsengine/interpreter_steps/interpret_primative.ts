import { InterpreterStep } from "./interpreter_step";
import { Interpreter } from "../interpreter";
import { TokenType } from "../tokenizer";

export class InterpretPrimative extends InterpreterStep {
    constructor(interpreter: Interpreter, nextStep: InterpreterStep | null = null) {
        super("InterpretPrimative", "Interpreting a primative value", interpreter, nextStep);
    }

    execute() {
        if (this.interpreter.match("LPAREN")) {
            let node = this.interpreter.parseExpression();
            this.interpreter.consume("RPAREN");

            return node;
        }
        else if (this.interpreter.match("BOOLEAN")) {
            return { type: "Boolean", value: this.interpreter.previous().value === "true" };
        }

        return null;
    }
}