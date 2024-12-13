"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterpretAssignment = void 0;
const interpreter_step_1 = require("./interpreter_step");
class InterpretAssignment extends interpreter_step_1.InterpreterStep {
    constructor(interpreter, nextStep = null) {
        super("InterpretAssignment", "Interpreting an assignment operator", interpreter, nextStep);
    }
    execute() {
        var _a;
        super.execute();
        // TODO: Implement function call interpretation
        return (_a = this.nextStep) === null || _a === void 0 ? void 0 : _a.execute();
    }
}
exports.InterpretAssignment = InterpretAssignment;
