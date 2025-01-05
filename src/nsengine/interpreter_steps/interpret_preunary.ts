/**
 * @file interpret_preunary.ts
 * @description Contains code to interpret a pre-unary operator
 */
import { InterpreterStep, InterpreterStepParams } from "./interpreter_step";
import { Interpreter } from "../interpreter";
import { compileTimeSolve, UnaryOpNode } from "../ast";
import { ASTNode } from "../ast";

export class InterpretPreUnary extends InterpreterStep {
    constructor(interpreter: Interpreter, nextStep: InterpreterStep | null = null) {
        super("InterpretPreUnary", "Interpreting a pre-unary operator", interpreter, nextStep);
    }
    
    execute(params?: InterpreterStepParams): ASTNode | undefined| null {
        if(this.verboseMode) this.log();
        let wasSatisfied = false;
        
        if (this.interpreter.match('MINUS', 'NOT')) {
            wasSatisfied = true;
            const op = this.interpreter.previous().value;
            let node = this.execute({
                ...params,
                returnFunctionCalls: true
            } as InterpreterStepParams);

            if(!node) {
                throw this.interpreter.error("Expected a node in unary operation");
            }
            
            let outputNode = {
                type: "UnaryOp",
                operator: op,
                operand: node as ASTNode,
                isKnownAtCompileTime: node.isKnownAtCompileTime
            } as UnaryOpNode;

            return outputNode;

            
        }
        return this.nextStep?.execute(params);
    }
}