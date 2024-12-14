import { InterpreterStep } from "./interpreter_step";
import { Interpreter } from "../interpreter";
import { AssignmentNode, ASTNode } from "../ast";

export class InterpretAssignment extends InterpreterStep {
    constructor(interpreter: Interpreter, nextStep: InterpreterStep | null = null) {
        super("InterpretAssignment", "Interpreting an assignment operator", interpreter, nextStep);
    }
    
    execute() {
        super.execute();
        // Capture the left node
        let lnode = this.nextStep?.execute();

        // Loop while there are more assignments
        while(!this.interpreter.isEOF() && this.interpreter.match("ASSIGN")) {
            // Fetch the operator and right node
            const operator = this.interpreter.previous().value;
            const rnode = this.nextStep?.execute();
            lnode = {
                type: "Assignment", 
                operator, 
                left: lnode as ASTNode, 
                right: rnode as ASTNode
            } as AssignmentNode;
        }
        // TODO: Implement function call interpretation
        return lnode;
    }
}