"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterpretStringLiteral = void 0;
const interpreter_step_1 = require("./interpreter_step");
const tokenizer_1 = require("../tokenizer");
class InterpretStringLiteral extends interpreter_step_1.InterpreterStep {
    constructor(interpreter, nextStep = null) {
        super("InterpretPrimative", "Interpreting a primative value", interpreter, nextStep);
    }
    execute() {
        var _a;
        this.log();
        if (this.interpreter.match("STRINGLITERAL")) {
            return {
                type: "String",
                value: this.interpreter.previous().value
            };
        }
        else if (this.interpreter.match("STRINGBUILDER")) {
            const re = /\$\{(.+?)\}/g;
            const originalString = this.interpreter.previous().value || "";
            const expressions = [...originalString.matchAll(re)].map((match) => match[1]);
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
                    const tokenizer = new tokenizer_1.Tokenizer(expression);
                    const tokens = tokenizer.tokenize();
                    const createSubInterpreter = this.interpreter.createSubInterpreter(tokens);
                    return createSubInterpreter.parseExpression();
                })
            };
        }
        else {
            return (_a = this.nextStep) === null || _a === void 0 ? void 0 : _a.execute();
        }
    }
}
exports.InterpretStringLiteral = InterpretStringLiteral;
