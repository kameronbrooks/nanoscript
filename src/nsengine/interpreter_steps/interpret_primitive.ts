/**
 * @file interpret_primitive.ts
 * @description Contains code to interpret a primative value (number, boolean, null)
 */
import { InterpreterStep, InterpreterStepParams } from "./interpreter_step";
import { Interpreter } from "../interpreter";
import { TokenType } from "../tokenizer";
import { NumberNode, NullNode, BooleanNode, StringNode, ASTNode } from "../ast";

export class InterpretPrimitive extends InterpreterStep {
    constructor(interpreter: Interpreter, nextStep: InterpreterStep | null = null) {
        super("InterpretPrimative", "Interpreting a primative value", interpreter, nextStep);
    }

    execute(params?: InterpreterStepParams): ASTNode | undefined| null {
        if(this.verboseMode) this.log();
        if (this.interpreter.match("LPAREN")) {
            let node = this.interpreter.parseExpression(params);
            this.interpreter.consume("RPAREN");

            return node;
        }
        else if (this.interpreter.match("BOOLEAN")) {
            return { 
                type: "Boolean", 
                value: this.interpreter.previous().value === "true",
                dtype: "bool",
                isKnownAtCompileTime: true
            } as BooleanNode;
        }
        else if (this.interpreter.match("NUMBER")) {
            const valueStr = this.interpreter.previous().value as string;
            if(valueStr.includes('.')) {
                return { 
                    type: "Number", 
                    value: parseFloat(valueStr),
                    dtype: "float",
                    isKnownAtCompileTime: true
                } as NumberNode;
            }
            else {
                return { 
                    type: "Number", 
                    value: parseInt(valueStr),
                    dtype: "int",
                    isKnownAtCompileTime: true
                } as NumberNode;
            }
        }
        else if(this.interpreter.match('NULL')) {
            return { 
                type: "Null", 
                value: null,
                isKnownAtCompileTime: true
            } as NullNode;
        }
        else {
            return this.nextStep?.execute(params);
        }

        return null;
    }
}