"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterpretIdentifier = void 0;
const interpreter_step_1 = require("./interpreter_step");
class InterpretIdentifier extends interpreter_step_1.InterpreterStep {
    constructor(interpreter, nextStep = null) {
        super("InterpretIdentifier", "Interpreting an identifier", interpreter, nextStep);
    }
    execute() {
        var _a;
        this.log();
        if (this.interpreter.match("IDENTIFIER")) {
            return { type: "Identifier", value: this.interpreter.previous().value };
        }
        else {
            return (_a = this.nextStep) === null || _a === void 0 ? void 0 : _a.execute();
        }
    }
}
exports.InterpretIdentifier = InterpretIdentifier;
