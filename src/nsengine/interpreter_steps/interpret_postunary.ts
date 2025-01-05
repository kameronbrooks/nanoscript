/**
 * @file interpret_postunary.ts
 * @description Contains code to interpret a post-unary operator
 */
import { InterpreterStep, InterpreterStepParams } from "./interpreter_step";
import { Interpreter } from "../interpreter";
import { UnaryOpNode, ASTNode } from "../ast";

export class InterpretPostUnary extends InterpreterStep {
    constructor(interpreter: Interpreter, nextStep: InterpreterStep | null = null) {
        super("InterpretPostUnary", "Interpreting a post-unary operator", interpreter, nextStep);
    }
    
    execute(params?: InterpreterStepParams): ASTNode | undefined| null {
        if(this.verboseMode) this.log();
        let lnode = this.nextStep?.execute(params);
        if (this.interpreter.match('INCREMENT')) {
            lnode = { 
                type: "UnaryOp", 
                operator: "++", 
                operand: lnode,
                postfix: true,
                isKnownAtCompileTime: false
            } as UnaryOpNode;
        }
        else if (this.interpreter.match('DECREMENT')) {
            lnode = { 
                type: "UnaryOp", 
                operator: "--", 
                operand: lnode,
                postfix: true,
                isKnownAtCompileTime: false
            } as UnaryOpNode;
        }

        return lnode;
    }
}