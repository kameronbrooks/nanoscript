import { InterpreterStep } from "./interpreter_step";
import { Interpreter } from "../interpreter";
import { UnaryOpNode } from "../ast";
import { ASTNode } from "../ast";

export class InterpretPreUnary extends InterpreterStep {
    constructor(interpreter: Interpreter, nextStep: InterpreterStep | null = null) {
        super("InterpretPreUnary", "Interpreting a pre-unary operator", interpreter, nextStep);
    }
    
    execute() : ASTNode | null | undefined {
        if(this.verboseMode) this.log();
        let wasSatisfied = false;
        if (this.interpreter.match('MINUS', 'NOT')) {
            wasSatisfied = true;
            const op = this.interpreter.previous().value;
            let node = this.execute();
            

            return { type: "UnaryOp", operator: op, operand: node as ASTNode } as UnaryOpNode;
        }
        return this.nextStep?.execute();
    }
}