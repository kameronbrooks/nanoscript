"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterpretEquality = void 0;
/**
 * @file interpret_equality.ts
 * @description Contains code to interpret an equality operator
 */
const interpreter_step_1 = require("./interpreter_step");
const ast_1 = require("../ast");
class InterpretEquality extends interpreter_step_1.InterpreterStep {
    constructor(interpreter, nextStep = null) {
        super("InterpretEquality", "Interpreting an equality operator", interpreter, nextStep);
    }
    execute(params) {
        var _a, _b;
        const childParams = Object.assign(Object.assign({}, params), { returnFunctionCalls: true });
        if (this.verboseMode)
            this.log();
        console.log("in comparison", params);
        // Capture the left node
        let lnode = (_a = this.nextStep) === null || _a === void 0 ? void 0 : _a.execute(params);
        // Loop while there are more assignments
        while (!this.interpreter.isEOF() && this.interpreter.match("EQUALITY", "INEQUALITY")) {
            // Fetch the operator and right node
            const operator = this.interpreter.previous().value;
            const rnode = (_b = this.nextStep) === null || _b === void 0 ? void 0 : _b.execute(childParams);
            lnode = (0, ast_1.createBinaryOpNode)(operator, lnode, rnode);
        }
        return lnode;
    }
}
exports.InterpretEquality = InterpretEquality;
