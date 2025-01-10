import { InterpreterStep, InterpreterStepParams } from "./interpreter_step";
import { Interpreter } from "../interpreter";
import { ASTNode, TernaryOpNode } from "../ast";

export class InterpretTernary extends InterpreterStep {
    constructor(interpreter: Interpreter, nextStep: InterpreterStep | null = null) {
        super("InterpretTernary", "Interpreting ternary operation", interpreter, nextStep);
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
        while (!this.interpreter.isEOF() && this.interpreter.match("QUESTION_MARK")) {
            // Fetch the operator and right node
            const operator = this.interpreter.previous().value;
            const nodeB = this.nextStep?.execute(childParams);

            this.interpreter.consume("COLON");

            const nodeC = this.nextStep?.execute(childParams);

            if(!lnode) {
                throw this.interpreter.error("Expected a left node in binary operation");
            }
            if(!nodeB) {
                throw this.interpreter.error("Expected a middle node in binary operation");
            }
            if(!nodeC) {
                throw this.interpreter.error("Expected a right node in binary operation");
            }

            const isKnownAtCompileTime = lnode.isKnownAtCompileTime && nodeB.isKnownAtCompileTime;

            lnode = {
                type: "TernaryOp",
                condition: lnode,
                left: nodeB,
                right: nodeC,
                isKnownAtCompileTime
            } as TernaryOpNode;


        }

        return lnode;
    }
}