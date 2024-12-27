"use strict";
/**
 * interpret_function_definition.ts
 * This file contains the function definition interpreter step.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterpretFunctionDefinition = void 0;
const interpreter_step_1 = require("./interpreter_step");
class InterpretFunctionDefinition extends interpreter_step_1.InterpreterStep {
    constructor(interpreter, nextStep = null) {
        super("InterpretFunctionDeclaration", "Interpreting an function definition", interpreter, nextStep);
    }
    execute() {
        if (this.verboseMode)
            this.log();
        if (this.interpreter.match("FUNCTION")) {
            let isAnonymous = true;
            let functionName = "anonymous";
            if (this.interpreter.match("IDENTIFIER")) {
                console.log("Function name: " + this.interpreter.previous().value);
                functionName = this.interpreter.previous().value || "anonymous";
                isAnonymous = false;
            }
            if (this.interpreter.match("LPAREN")) {
                const argNodes = [];
                while (!this.interpreter.isEOF() && !this.interpreter.match("RPAREN")) {
                    if (this.interpreter.match("IDENTIFIER")) {
                        argNodes.push({ type: "Identifier", value: this.interpreter.previous().value });
                    }
                    else {
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
                    body: body
                };
            }
            throw new Error("Expected a function body");
        }
        else {
            return (this.nextStep) ? this.nextStep.execute() : null;
        }
    }
}
exports.InterpretFunctionDefinition = InterpretFunctionDefinition;
