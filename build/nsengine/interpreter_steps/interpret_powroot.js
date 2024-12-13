"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterpretPowRoot = void 0;
const interpreter_step_1 = require("./interpreter_step");
class InterpretPowRoot extends interpreter_step_1.InterpreterStep {
    constructor(interpreter, nextStep = null) {
        super("InterpretPowRoot", "Interpreting power and sqrt", interpreter, nextStep);
    }
    execute() {
        var _a;
        super.execute();
        // TODO: Implement function call interpretation
        return (_a = this.nextStep) === null || _a === void 0 ? void 0 : _a.execute();
    }
}
exports.InterpretPowRoot = InterpretPowRoot;
