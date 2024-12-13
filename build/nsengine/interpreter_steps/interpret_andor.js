"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterpretAndOr = void 0;
const interpreter_step_1 = require("./interpreter_step");
class InterpretAndOr extends interpreter_step_1.InterpreterStep {
    constructor(interpreter, nextStep = null) {
        super("InterpretAndOr", "Interpreting and or ", interpreter, nextStep);
    }
    execute() {
        var _a;
        super.execute();
        // TODO: Implement function call interpretation
        return (_a = this.nextStep) === null || _a === void 0 ? void 0 : _a.execute();
    }
}
exports.InterpretAndOr = InterpretAndOr;
