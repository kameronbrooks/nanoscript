import { InterpreterStep, InterpreterStepParams } from "./interpreter_step";
import { Interpreter } from "../interpreter";
import { ASTNode, BinaryOpNode, compileTimeSolve, createBinaryOpNode } from "../ast";

export class InterpretAddSub extends InterpreterStep {
    constructor(interpreter: Interpreter, nextStep: InterpreterStep | null = null) {
        super("InterpretAddSubb", "Interpreting add and subtract", interpreter, nextStep);
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
        while (!this.interpreter.isEOF() && this.interpreter.match("PLUS", "MINUS")) {
            // Fetch the operator and right node
            const operator = this.interpreter.previous().value;
            const rnode = this.nextStep?.execute(childParams);

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