/**
 * @file interpret_powroot.ts
 * @description Contains code to interpret a power and sqrt operator
 */

import { InterpreterStep, InterpreterStepParams } from "./interpreter_step";
import { Interpreter } from "../interpreter";
import { createBinaryOpNode, BinaryOpNode, ASTNode, compileTimeSolve } from "../ast";

export class InterpretPowRoot extends InterpreterStep {
    constructor(interpreter: Interpreter, nextStep: InterpreterStep | null = null) {
        super("InterpretPowRoot", "Interpreting power and sqrt", interpreter, nextStep);
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
        while (!this.interpreter.isEOF() && this.interpreter.match("POWER", "SQRT")) {
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