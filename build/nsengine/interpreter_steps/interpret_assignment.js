"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterpretAssignment = void 0;
/**
 * @file interpret_assignment.ts
 * @description Contains code to interpret an assignment operator
 */
const interpreter_step_1 = require("./interpreter_step");
class InterpretAssignment extends interpreter_step_1.InterpreterStep {
    constructor(interpreter, nextStep = null) {
        super("InterpretAssignment", "Interpreting an assignment operator", interpreter, nextStep);
    }
    execute(params) {
        var _a, _b;
        const childParams = Object.assign(Object.assign({}, params), { returnFunctionCalls: true });
        if (this.verboseMode)
            this.log();
        // Capture the left node
        let lnode = (_a = this.nextStep) === null || _a === void 0 ? void 0 : _a.execute(params);
        // Loop while there are more assignments
        while (!this.interpreter.isEOF() && this.interpreter.match("ASSIGN")) {
            // Fetch the operator and right node
            const operator = this.interpreter.previous().value;
            const rnode = (_b = this.nextStep) === null || _b === void 0 ? void 0 : _b.execute(childParams);
            lnode = {
                type: "Assignment",
                operator,
                left: lnode,
                right: rnode
            };
        }
        return lnode;
    }
}
exports.InterpretAssignment = InterpretAssignment;
