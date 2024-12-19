"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterpretAndOr = void 0;
const interpreter_step_1 = require("./interpreter_step");
const ast_1 = require("../ast");
class InterpretAndOr extends interpreter_step_1.InterpreterStep {
    constructor(interpreter, nextStep = null) {
        super("InterpretAndOr", "Interpreting and or ", interpreter, nextStep);
    }
    execute() {
        var _a, _b;
        if (this.verboseMode)
            this.log();
        // Capture the left node
        let lnode = (_a = this.nextStep) === null || _a === void 0 ? void 0 : _a.execute();
        // Loop while there are more assignments
        while (!this.interpreter.isEOF() && this.interpreter.match("AND", "OR")) {
            // Fetch the operator and right node
            const operator = this.interpreter.previous().value;
            const rnode = (_b = this.nextStep) === null || _b === void 0 ? void 0 : _b.execute();
            lnode = (0, ast_1.createBinaryOpNode)(operator, lnode, rnode);
        }
        return lnode;
    }
}
exports.InterpretAndOr = InterpretAndOr;
