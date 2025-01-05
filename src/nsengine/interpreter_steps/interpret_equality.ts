/**
 * @file interpret_equality.ts
 * @description Contains code to interpret an equality operator
 */
import { InterpreterStep, InterpreterStepParams } from "./interpreter_step";
import { Interpreter } from "../interpreter";
import { createBinaryOpNode, BinaryOpNode, ASTNode } from "../ast";

export class InterpretEquality extends InterpreterStep {
    constructor(interpreter: Interpreter, nextStep: InterpreterStep | null = null) {
        super("InterpretEquality", "Interpreting an equality operator", interpreter, nextStep);
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
        if (!this.interpreter.isEOF() && this.interpreter.match("EQUALITY", "INEQUALITY")) {
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