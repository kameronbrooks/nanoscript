/**
 * @file  interpret_objectliteral.ts
 * @description Contains code to interpret an object literal
 */
import { InterpreterStep, InterpreterStepParams } from "./interpreter_step";
import { Interpreter } from "../interpreter";
import { TokenType } from "../tokenizer";
import { ASTNode, ObjectLiteralNode, SetLiteralNode } from "../ast";

export class InterpretObjectLiteral extends InterpreterStep {
    constructor(interpreter: Interpreter, nextStep: InterpreterStep | null = null) {
        super("ObjectLiteralNode", "Interpreting an object literal", interpreter, nextStep);
    }

    execute(params?: InterpreterStepParams): ASTNode | undefined | null {
        if (this.verboseMode) this.log();
        if (this.interpreter.match("LBRACE")) {

            let lnode;

            // Check to see if this is and object literal or a set literal
            // If the next token is a string literal followed by a colon, it is an object literal
            // If the next token is a closing brace, it is also assumed to be an empty object
            if (this.interpreter.patternLookahead(["STRINGLITERAL", "COLON"]) || this.interpreter.peek().type === "RBRACE") {
                // Object literal
                lnode = {
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

                // Determine if the object literal is known at compile time
                lnode.isKnownAtCompileTime = (lnode.properties.length == 0) || (lnode.properties.every(p => p.value.isKnownAtCompileTime));
            }
            else {
                // Set literal
                lnode = {
                    type: "SetLiteral",
                    elements: []
                } as SetLiteralNode;

                while (!this.interpreter.isEOF() && !this.interpreter.match("RBRACE")) {
                    let argNode = this.interpreter.parseExpression({
                        ...params,
                        returnFunctionCalls: true,   // if any function calls are encountered, they need to return something
                    });
    
                    lnode.elements.push(argNode as ASTNode);
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

                // Determine if the object literal is known at compile time
                lnode.isKnownAtCompileTime = lnode.elements.every(p => p.isKnownAtCompileTime);
            }

            if (lnode === undefined) {
                throw this.interpreter.error("Expected object or set literal");
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