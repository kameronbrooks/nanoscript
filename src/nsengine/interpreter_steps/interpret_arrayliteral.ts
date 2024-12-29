/**
 * @file interpret_primitive.ts
 * @description Contains code to interpret a primative value (number, boolean, null)
 */
import { InterpreterStep, InterpreterStepParams } from "./interpreter_step";
import { Interpreter } from "../interpreter";
import { TokenType } from "../tokenizer";
import { ASTNode, ArrayLiteralNode } from "../ast";

export class InterpretArrayLiteral extends InterpreterStep {
    constructor(interpreter: Interpreter, nextStep: InterpreterStep | null = null) {
        super("InterpretArrayLiteral", "Interpreting an array literal", interpreter, nextStep);
    }

    execute(params?: InterpreterStepParams): ASTNode | undefined | null {
        if (this.verboseMode) this.log();
        if (this.interpreter.match("LBRACKET")) {
            

            let elementNodes: ASTNode[] = [];
            while (!this.interpreter.isEOF() && !this.interpreter.match("RBRACKET")) {
                let argNode = this.interpreter.parseExpression({
                    ...params,
                    returnFunctionCalls: true,
                });
                elementNodes.push(argNode as ASTNode);
                if (this.interpreter.match("COMMA")) {
                    continue;
                }
            }

            // TODO: Add compile-time array literal support if all the elements can be evaluated at compile time

            let lnode = {
                type: "ArrayLiteral",
                elements: elementNodes
            } as ArrayLiteralNode;

            if (this.interpreter.peek().type === 'EOS') {
                return lnode;
            }
            
            // Special case for member access
            let memberAccessNode = this.interpreter.expressionSteps.memberAccess.execute({...params, backwardsLookingNode: lnode}) as ASTNode;
            if (memberAccessNode) {
                return memberAccessNode;
            }
            // Special case for indexer
            let indexerNode = this.interpreter.expressionSteps.indexer.execute({...params, backwardsLookingNode: lnode}) as ASTNode;
            if (indexerNode) {
                return indexerNode;
            }

        }

        return this.nextStep?.execute(params);

    }
}