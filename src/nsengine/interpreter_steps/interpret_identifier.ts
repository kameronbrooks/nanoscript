/**
 * @file interpret_identifier.ts
 * @description Contains code to interpret an identifier
 */
import { InterpreterStep, InterpreterStepParams } from "./interpreter_step";
import { Interpreter } from "../interpreter";
import { ASTNode } from "../ast";

export class InterpretIdentifier extends InterpreterStep {
    constructor(interpreter: Interpreter, nextStep: InterpreterStep | null = null) {
        super("InterpretIdentifier", "Interpreting an identifier", interpreter, nextStep);
    }

    execute(params?: InterpreterStepParams): ASTNode | undefined| null {
        if(this.verboseMode) this.log();
        if (this.interpreter.match("IDENTIFIER")) {
            return { 
                type: "Identifier", 
                value: this.interpreter.previous().value, 
                isKnownAtCompileTime: false 
            } as ASTNode;
        }
        else {
            return this.nextStep?.execute();
        }
    }
}