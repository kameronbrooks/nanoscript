import { InterpreterStep } from "./interpreter_step";
import { Interpreter } from "../interpreter";
import { createBinaryOpNode, BinaryOpNode, ASTNode, FunctionCallNode } from "../ast";

export class InterpretFunctionCall extends InterpreterStep {
    constructor(interpreter: Interpreter, nextStep: InterpreterStep | null = null) {
        super("InterpretFunctionCall", "Interpreting a function call", interpreter, nextStep);
    }

    execute(backwardLookingNode: ASTNode | null = null) {
        this.log();
        // Capture the left node, if we are not backward looking
        let lnode = backwardLookingNode || this.nextStep?.execute();

        // Loop while there are more assignments
        if (this.interpreter.match("LPAREN")) {
            // Fetch the operator and right node
            const argNodes: ASTNode[] = [];

            while(!this.interpreter.isEOF() && !this.interpreter.match("RPAREN")) {
                let argNode = this.interpreter.parseExpression();
                argNodes.push(argNode as ASTNode);
                console.log(argNode);
                if (this.interpreter.match("COMMA")) {
                    continue;
                }
            }

            lnode = {
                type: "FunctionCall",
                left: lnode as ASTNode,
                arguments: argNodes
            } as FunctionCallNode;
        }

        return lnode;
    }
}