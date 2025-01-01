/**
 * @file  interpret_objectliteral.ts
 * @description Contains code to interpret an object literal
 */
import { InterpreterStep, InterpreterStepParams } from "./interpreter_step";
import { Interpreter } from "../interpreter";
import { TokenType } from "../tokenizer";
import { ASTNode, ObjectLiteralNode } from "../ast";

export class InterpretObjectLiteral extends InterpreterStep {
    constructor(interpreter: Interpreter, nextStep: InterpreterStep | null = null) {
        super("ObjectLiteralNode", "Interpreting an object literal", interpreter, nextStep);
    }

    execute(params?: InterpreterStepParams): ASTNode | undefined | null {
        if (this.verboseMode) this.log();
        if (this.interpreter.match("LBRACE")) {
            

            let lnode = {
                type: "ObjectLiteral",
                properties: []
            } as ObjectLiteralNode;

            while (!this.interpreter.isEOF() && !this.interpreter.match("RBRACE")) {
                if(!this.interpreter.match("STRINGLITERAL")) {
                    this.interpreter.error("Expected an identifier in object literal");
                }
                let key = this.interpreter.previous().value;
                if (key) {
                    key = key.substring(1, key.length - 1);
                }
                if (!this.interpreter.match("COLON")) {
                    this.interpreter.error("Expected a colon in object literal");
                }
                let argNode = this.interpreter.parseExpression({
                    ...params,
                    returnFunctionCalls: true,   // if any function calls are encountered, they need to return something
                });

                lnode.properties.push({key: key as string, value: argNode as ASTNode});
                if (this.interpreter.match("COMMA")) {
                    continue;
                }

                // If we have a closing brace, we are done
                if (this.interpreter.match("RBRACE")) {
                    break;
                }
                // Otherwise, we have an error
                this.interpreter.error(`Expected a comma or closing brace, found ${this.interpreter.peek().type}`);
            }

            // TODO: Add compile-time array literal support if all the elements can be evaluated at compile time

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