"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterpretStringLiteral = void 0;
const interpreter_step_1 = require("./interpreter_step");
class InterpretStringLiteral extends interpreter_step_1.InterpreterStep {
    constructor(interpreter, nextStep = null) {
        super("InterpretPrimative", "Interpreting a primative value", interpreter, nextStep);
    }
    execute() {
        var _a;
        if (this.verboseMode)
            this.log();
        if (this.interpreter.match("STRINGLITERAL")) {
            return {
                type: "String",
                value: this.interpreter.previous().value
            };
        }
        else if (this.interpreter.match("STRINGBUILDER")) {
            const { value, subExpressions } = this.interpreter.previous();
            // Parse the expressions and save them in the  expressions array
            // This requires a new tokenizer and interpreter
            // The interpreter is a sub-interpreter generated from the current interpreter
            return {
                type: "StringBuilder",
                string: value,
                expressions: subExpressions.map((tokens) => {
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
