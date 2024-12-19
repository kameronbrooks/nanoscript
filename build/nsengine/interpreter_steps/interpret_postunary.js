"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterpretPostUnary = void 0;
const interpreter_step_1 = require("./interpreter_step");
class InterpretPostUnary extends interpreter_step_1.InterpreterStep {
    constructor(interpreter, nextStep = null) {
        super("InterpretPostUnary", "Interpreting a post-unary operator", interpreter, nextStep);
    }
    execute() {
        var _a;
        if (this.verboseMode)
            this.log();
        let lnode = (_a = this.nextStep) === null || _a === void 0 ? void 0 : _a.execute();
        if (this.interpreter.match('INCREMENT')) {
            lnode = {
                type: "UnaryOp",
                operator: "++",
                operand: lnode,
                postfix: true
            };
        }
        else if (this.interpreter.match('DECREMENT')) {
            lnode = {
                type: "UnaryOp",
                operator: "--",
                operand: lnode,
                postfix: true
            };
        }
        return lnode;
    }
}
exports.InterpretPostUnary = InterpretPostUnary;
