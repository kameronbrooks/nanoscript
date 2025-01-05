/**
 * @file interpret_arrayliteral.ts
 * @description Contains code to interpret an array literal
 */
import { InterpreterStep, InterpreterStepParams } from "./interpreter_step";
import { Interpreter } from "../interpreter";
import { TokenType } from "../tokenizer";
import { ASTNode, ArrayLiteralNode, compileTimeSolve } from "../ast";

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
                    returnFunctionCalls: true,   // if any function calls are encountered, they need to return something
                });
                elementNodes.push(argNode as ASTNode);
                if (this.interpreter.match("COMMA")) {
                    continue;
                }

                // If we have a closing bracket, we are done
                if (this.interpreter.match("RBRACKET")) {
                    break;
                }
                // Otherwise, we have an error
                this.interpreter.error(`Expected a comma or closing bracket in indexer, found ${this.interpreter.peek().type}`);
            }

            // TODO: Add compile-time array literal support if all the elements can be evaluated at compile time

            let lnode = {
                type: "ArrayLiteral",
                elements: elementNodes,
                isKnownAtCompileTime: elementNodes.every(e => e.isKnownAtCompileTime)
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