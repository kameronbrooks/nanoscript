import { InterpreterStep } from "./interpreter_step";
import { Interpreter } from "../interpreter";
import { createBinaryOpNode, BinaryOpNode, ASTNode } from "../ast";

export class InterpretMulDiv extends InterpreterStep {
    constructor(interpreter: Interpreter, nextStep: InterpreterStep | null = null) {
        super("InterpretMulDiv", "Interpreting multiply and divide", interpreter, nextStep);
    }
    
    execute() {
        if(this.verboseMode) this.log();
        // Capture the left node
        let lnode = this.nextStep?.execute();

        // Loop while there are more assignments
        while (!this.interpreter.isEOF() && this.interpreter.match("MULTIPLY", "DIVIDE")) {
            // Fetch the operator and right node
            const operator = this.interpreter.previous().value;
            const rnode = this.nextStep?.execute();
            lnode = createBinaryOpNode(operator as string, lnode as ASTNode, rnode as ASTNode);
        }

        return lnode;
    }
}