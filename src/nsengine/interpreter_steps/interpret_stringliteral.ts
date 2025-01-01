/**
 * @file interpret_stringliteral.ts
 * @description Contains code to interpret a string literal
 */
import { InterpreterStep, InterpreterStepParams } from "./interpreter_step";
import { Interpreter } from "../interpreter";
import { StringBuilderToken, Token, TokenType, Tokenizer } from "../tokenizer";
import { StringNode, ASTNode } from "../ast";
import { StringBuilderNode } from "../ast";

export class InterpretStringLiteral extends InterpreterStep {
    constructor(interpreter: Interpreter, nextStep: InterpreterStep | null = null) {
        super("InterpretPrimative", "Interpreting a primative value", interpreter, nextStep);
    }

    execute(params?: InterpreterStepParams): ASTNode | undefined| null {
        if(this.verboseMode) this.log();
        if (this.interpreter.match("STRINGLITERAL")) {
            const stringValue = this.interpreter.previous().value;

            if (stringValue) {
                return { 
                    type: "String", 
                    value: stringValue.substring(1, stringValue.length - 1)
                } as StringNode;
            }

            return { 
                type: "String", 
                value: ""
            } as StringNode;
        }
        else if (this.interpreter.match("STRINGBUILDER")) {
            const {value, subExpressions} = (this.interpreter.previous() as StringBuilderToken)
            // Parse the expressions and save them in the  expressions array
            // This requires a new tokenizer and interpreter
            // The interpreter is a sub-interpreter generated from the current interpreter
            if (value) {
                return { 
                    type: "StringBuilder", 
                    string: value.substring(1, value.length - 1),
                    expressions: (subExpressions as Token[][]).map((tokens) => {
                        const createSubInterpreter = this.interpreter.createSubInterpreter(tokens);
                        return createSubInterpreter.parseExpression();
                    })
                } as StringBuilderNode;
            }

            return { 
                type: "StringBuilder", 
                string: "",
                expressions: []
            } as StringBuilderNode;

            
        }
        else {
            return this.nextStep?.execute();
        }
    }
}