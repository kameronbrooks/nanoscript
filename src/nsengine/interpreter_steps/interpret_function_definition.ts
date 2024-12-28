/**
 * interpret_function_definition.ts
 * This file contains the function definition interpreter step.
 */

import { InterpreterStep, InterpreterStepParams } from "./interpreter_step";
import { Interpreter } from "../interpreter";
import { ASTNode, FunctionDeclarationNode } from "../ast";

export class InterpretFunctionDefinition extends InterpreterStep {
    constructor(interpreter: Interpreter, nextStep: InterpreterStep | null = null) {
        super("InterpretFunctionDeclaration", "Interpreting an function definition", interpreter, nextStep);
    }

    execute(params?: InterpreterStepParams): ASTNode | undefined| null {
        if(this.verboseMode) this.log();
        
        if (this.interpreter.match("FUNCTION")) {
            let isAnonymous = true;
            let functionName = "anonymous";
            if (this.interpreter.match("IDENTIFIER")) {
                functionName = this.interpreter.previous().value || "anonymous";
                isAnonymous = false;

            }

            if (this.interpreter.match("LPAREN")) {
                const argNodes: ASTNode[] = [];

                while(!this.interpreter.isEOF() && !this.interpreter.match("RPAREN")) {
                    if (this.interpreter.match("IDENTIFIER")) {
                        argNodes.push({ type: "Identifier", value: this.interpreter.previous().value } as ASTNode);
                    } else {
                        throw new Error("Expected an identifier in function arguments");
                    }
                    if (this.interpreter.match("COMMA")) {
                        continue;
                    }
                }

                let body = this.interpreter.parseStatement();

                return {
                    type: "FunctionDeclaration",
                    name: functionName,
                    arguments: argNodes,
                    body: body as ASTNode
                } as FunctionDeclarationNode;
            }

            throw new Error("Expected a function body");
        }
        else {
            return (this.nextStep) ? this.nextStep.execute() : null;
        }
    }
}