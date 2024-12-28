/**
 * @file interpret_assignment.ts
 * @description Contains code to interpret an assignment operator
 */
import { InterpreterStep, InterpreterStepParams } from "./interpreter_step";
import { Interpreter } from "../interpreter";
import { AssignmentNode, ASTNode } from "../ast";

export class InterpretAssignment extends InterpreterStep {
    constructor(interpreter: Interpreter, nextStep: InterpreterStep | null = null) {
        super("InterpretAssignment", "Interpreting an assignment operator", interpreter, nextStep);
    }
    
    execute(params?: InterpreterStepParams): ASTNode | undefined| null {
        const childParams = {
            ...params,
            returnFunctionCalls: true
        } as InterpreterStepParams;

        if(this.verboseMode) this.log();
        // Capture the left node
        let lnode = this.nextStep?.execute(params);

        // Loop while there are more assignments
        while(!this.interpreter.isEOF() && this.interpreter.match("ASSIGN")) {
            // Fetch the operator and right node
            const operator = this.interpreter.previous().value;
            const rnode = this.nextStep?.execute(childParams);
            lnode = {
                type: "Assignment", 
                operator, 
                left: lnode as ASTNode, 
                right: rnode as ASTNode
            } as AssignmentNode;
        }

        return lnode;
    }
}