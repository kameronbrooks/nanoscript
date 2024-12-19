import { InterpreterStep } from "./interpreter_step";
import { Interpreter } from "../interpreter";
import { ASTNode, BinaryOpNode, createBinaryOpNode } from "../ast";

export class InterpretAddSub extends InterpreterStep {
    constructor(interpreter: Interpreter, nextStep: InterpreterStep | null = null) {
        super("InterpretAddSubb", "Interpreting add and subtract", interpreter, nextStep);
    }

    execute() {
        if(this.verboseMode) this.log();
        // Capture the left node
        let lnode = this.nextStep?.execute();

        // Loop while there are more assignments
        while (!this.interpreter.isEOF() && this.interpreter.match("PLUS", "MINUS")) {
            // Fetch the operator and right node
            const operator = this.interpreter.previous().value;
            const rnode = this.nextStep?.execute();
            lnode = createBinaryOpNode(operator as string, lnode as ASTNode, rnode as ASTNode);
        }

        return lnode;
    }
}