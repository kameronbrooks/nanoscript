"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterpretAssignment = void 0;
const interpreter_step_1 = require("./interpreter_step");
class InterpretAssignment extends interpreter_step_1.InterpreterStep {
    constructor(interpreter, nextStep = null) {
        super("InterpretAssignment", "Interpreting an assignment operator", interpreter, nextStep);
    }
    execute() {
        var _a, _b;
        super.execute();
        // Capture the left node
        let lnode = (_a = this.nextStep) === null || _a === void 0 ? void 0 : _a.execute();
        // Loop while there are more assignments
        while (!this.interpreter.isEOF() && this.interpreter.match("ASSIGN")) {
            // Fetch the operator and right node
            const operator = this.interpreter.previous().value;
            const rnode = (_b = this.nextStep) === null || _b === void 0 ? void 0 : _b.execute();
            lnode = {
                type: "Assignment",
                operator,
                left: lnode,
                right: rnode
            };
        }
        // TODO: Implement function call interpretation
        return lnode;
    }
}
exports.InterpretAssignment = InterpretAssignment;
