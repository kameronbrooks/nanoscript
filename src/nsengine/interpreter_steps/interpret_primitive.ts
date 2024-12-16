import { InterpreterStep } from "./interpreter_step";
import { Interpreter } from "../interpreter";
import { TokenType } from "../tokenizer";

export class InterpretPrimitive extends InterpreterStep {
    constructor(interpreter: Interpreter, nextStep: InterpreterStep | null = null) {
        super("InterpretPrimative", "Interpreting a primative value", interpreter, nextStep);
    }

    execute() {
        this.log();
        if (this.interpreter.match("LPAREN")) {
            let node = this.interpreter.parseExpression();
            this.interpreter.consume("RPAREN");

            return node;
        }
        else if (this.interpreter.match("BOOLEAN")) {
            return { type: "Boolean", value: this.interpreter.previous().value === "true" };
        }
        else if (this.interpreter.match("NUMBER")) {
            return { type: "Number", value: parseFloat(this.interpreter.previous().value as string) };
        }
        else if(this.interpreter.match('NULL')) {
            return { type: "Null", value: null };
        }
        else {
            return this.nextStep?.execute();
        }

        return null;
    }
}