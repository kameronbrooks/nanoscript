import { InterpreterStep } from "./interpreter_step";
import { Interpreter } from "../interpreter";
import { TokenType, Tokenizer } from "../tokenizer";
import { StringNode } from "../ast";
import { StringBuilderNode } from "../ast";

export class InterpretStringLiteral extends InterpreterStep {
    constructor(interpreter: Interpreter, nextStep: InterpreterStep | null = null) {
        super("InterpretPrimative", "Interpreting a primative value", interpreter, nextStep);
    }

    execute() {
        this.log();
        if (this.interpreter.match("STRINGLITERAL")) {
            return { 
                type: "String", 
                value: this.interpreter.previous().value 
            } as StringNode;
        }
        else if (this.interpreter.match("STRINGBUILDER")) {
            const re = /\$\{(.+?)\}/g;
            const originalString = this.interpreter.previous().value || "";
            const expressions = [...(originalString.matchAll(re) as IterableIterator<RegExpExecArray>)].map((match) => match[1]);
            let index = 0;
            const newString = originalString.replace(re, () => {
                return `\${${index++}}`;
            });
            console.log(expressions);
            console.log(newString);

            // Parse the expressions and save them in the  expressions array
            // This requires a new tokenizer and interpreter
            // The interpreter is a sub-interpreter generated from the current interpreter
            return { 
                type: "StringBuilder", 
                string: newString,
                expressions: expressions.map((expression) => {
                    const tokenizer = new Tokenizer(expression);
                    const tokens = tokenizer.tokenize();
                    const createSubInterpreter = this.interpreter.createSubInterpreter(tokens);
                    return createSubInterpreter.parseExpression();
                }
            )
            } as StringBuilderNode;
        }
        else {
            return this.nextStep?.execute();
        }
    }
}