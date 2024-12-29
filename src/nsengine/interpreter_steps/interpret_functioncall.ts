/**
 * @file interpret_functioncall.ts
 * @description Contains code to interpret a function call
 */

import { InterpreterStep, InterpreterStepParams } from "./interpreter_step";
import { Interpreter } from "../interpreter";
import { createBinaryOpNode, BinaryOpNode, ASTNode, FunctionCallNode } from "../ast";

export class InterpretFunctionCall extends InterpreterStep {
    constructor(interpreter: Interpreter, nextStep: InterpreterStep | null = null) {
        super("InterpretFunctionCall", "Interpreting a function call", interpreter, nextStep);
    }

    execute(params?: InterpreterStepParams): ASTNode | undefined| null {
        if(this.verboseMode) this.log();
        
        // Capture the left node, if we are not backward looking
        let lnode = params?.backwardsLookingNode || this.nextStep?.execute(params);

        // Loop while there are more assignments
        if (this.interpreter.match("LPAREN")) {
            // Fetch the operator and right node
            const argNodes: ASTNode[] = [];

            while(!this.interpreter.isEOF() && !this.interpreter.match("RPAREN")) {
                let argNode = this.interpreter.parseExpression( {
                    ...params,
                    returnFunctionCalls: true,   // if any function calls are encountered, they need to return something
                    backwardsLookingNode: undefined // we have to consume the backwards looking node if there is one. Do not pass it on to the arguments
                });
                argNodes.push(argNode as ASTNode);
                if (this.interpreter.match("COMMA")) {
                    continue;
                }

                // If we have a closing parenthesis, we are done
                if (this.interpreter.match("RPAREN")) {
                    break;
                }
                // Otherwise, we have an error
                this.interpreter.error(`Expected a comma or closing parenthesis in function call, found ${this.interpreter.peek().type}`);
            }
            
            lnode = {
                type: "FunctionCall",
                left: lnode as ASTNode,
                arguments: argNodes,
                requireReturn: params?.returnFunctionCalls || false
            } as FunctionCallNode;

            if (this.interpreter.peek().type === 'EOS') {
                return lnode;
            }
            
            // Special case for member access
            let memberAccessNode = this.interpreter.expressionSteps.memberAccess.execute({...params, backwardsLookingNode: lnode}) as ASTNode;
            if (memberAccessNode) {
                lnode = memberAccessNode;
            }
            // Special case for indexer
            let indexerNode = this.interpreter.expressionSteps.indexer.execute({...params, backwardsLookingNode: lnode}) as ASTNode;
            if (indexerNode) {
                lnode = indexerNode;
            }
        }

        return lnode;
    }
}