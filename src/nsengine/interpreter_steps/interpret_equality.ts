/**
 * @file interpret_equality.ts
 * @description Contains code to interpret an equality operator
 */
import { InterpreterStep } from "./interpreter_step";
import { Interpreter } from "../interpreter";
import { createBinaryOpNode, BinaryOpNode, ASTNode } from "../ast";

export class InterpretEquality extends InterpreterStep {
    constructor(interpreter: Interpreter, nextStep: InterpreterStep | null = null) {
        super("InterpretEquality", "Interpreting an equality operator", interpreter, nextStep);
    }
    
    execute() {
        if(this.verboseMode) this.log();
        // Capture the left node
        let lnode = this.nextStep?.execute();

        // Loop while there are more assignments
        while (!this.interpreter.isEOF() && this.interpreter.match("EQUALITY", "INEQUALITY")) {
            // Fetch the operator and right node
            const operator = this.interpreter.previous().value;
            const rnode = this.nextStep?.execute();
            lnode = createBinaryOpNode(operator as string, lnode as ASTNode, rnode as ASTNode);
        }

        return lnode;
    }
}