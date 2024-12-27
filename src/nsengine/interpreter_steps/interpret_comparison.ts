/**
 * @file interpret_comparison.ts
 * @description Contains code to interpret a comparison operator
 */

import { InterpreterStep } from "./interpreter_step";
import { Interpreter } from "../interpreter";
import { ASTNode, BinaryOpNode, createBinaryOpNode } from "../ast";

export class InterpretComparison extends InterpreterStep {
    constructor(interpreter: Interpreter, nextStep: InterpreterStep | null = null) {
        super("InterpretComparison", "Interpreting a comparison operator", interpreter, nextStep);
    }
    
    execute() {
        if(this.verboseMode) this.log();
        // Capture the left node
        let lnode = this.nextStep?.execute();

        // Loop while there are more assignments
        while (!this.interpreter.isEOF() && this.interpreter.match("GREATER_THAN", "LESS_THAN", "GREATER_THAN_OR_EQUAL", "LESS_THAN_OR_EQUAL")) {
            // Fetch the operator and right node
            const operator = this.interpreter.previous().value;
            const rnode = this.nextStep?.execute();
            lnode = createBinaryOpNode(operator as string, lnode as ASTNode, rnode as ASTNode);
        }

        return lnode;
    }
}