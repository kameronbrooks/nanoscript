"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterpretPrimative = void 0;
const interpreter_step_1 = require("./interpreter_step");
class InterpretPrimative extends interpreter_step_1.InterpreterStep {
    constructor(interpreter, nextStep = null) {
        super("InterpretPrimative", "Interpreting a primative value", interpreter, nextStep);
    }
    execute() {
        var _a;
        super.execute();
        if (this.interpreter.match("LPAREN")) {
            let node = this.interpreter.parseExpression();
            this.interpreter.consume("RPAREN");
            return node;
        }
        else if (this.interpreter.match("BOOLEAN")) {
            return { type: "Boolean", value: this.interpreter.previous().value === "true" };
        }
        else if (this.interpreter.match("NUMBER")) {
            return { type: "Number", value: parseFloat(this.interpreter.previous().value) };
        }
        else {
            return (_a = this.nextStep) === null || _a === void 0 ? void 0 : _a.execute();
        }
        return null;
    }
}
exports.InterpretPrimative = InterpretPrimative;
