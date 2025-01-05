/**
 * @file interpret_comparison.ts
 * @description Contains code to interpret a comparison operator
 */

import { InterpreterStep, InterpreterStepParams } from "./interpreter_step";
import { Interpreter } from "../interpreter";
import { ASTNode, BinaryOpNode, createBinaryOpNode } from "../ast";

export class InterpretComparison extends InterpreterStep {
    constructor(interpreter: Interpreter, nextStep: InterpreterStep | null = null) {
        super("InterpretComparison", "Interpreting a comparison operator", interpreter, nextStep);
    }
    
    execute(params?: InterpreterStepParams): ASTNode | undefined| null {
        const childParams = {
            ...params,
            returnFunctionCalls: true   // if any function calls are encountered, they need to return something
        } as InterpreterStepParams;

        if(this.verboseMode) this.log();
        
        
        // Capture the left node
        let lnode = this.nextStep?.execute(params);

        // Loop while there are more assignments
        if (!this.interpreter.isEOF() && this.interpreter.match("GREATER_THAN", "LESS_THAN", "GREATER_THAN_OR_EQUAL", "LESS_THAN_OR_EQUAL")) {
            // Fetch the operator and right node
            const operator = this.interpreter.previous().value;
            const rnode = this.nextStep?.execute(childParams);
            //lnode = createBinaryOpNode(operator as string, lnode as ASTNode, rnode as ASTNode);

            if(!lnode) {
                throw this.interpreter.error("Expected a left node in binary operation");
            }
            if(!rnode) {
                throw this.interpreter.error("Expected a right node in binary operation");
            }

            const isKnownAtCompileTime = lnode.isKnownAtCompileTime && rnode.isKnownAtCompileTime;

            lnode = {
                type: "BinaryOp",
                operator: operator as string,
                left: lnode,
                right: rnode,
                isKnownAtCompileTime: isKnownAtCompileTime
            } as BinaryOpNode;
        }

        return lnode;
    }
}