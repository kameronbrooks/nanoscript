"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterpretFunctionCall = void 0;
const interpreter_step_1 = require("./interpreter_step");
class InterpretFunctionCall extends interpreter_step_1.InterpreterStep {
    constructor(interpreter, nextStep = null) {
        super("InterpretFunctionCall", "Interpreting a function call", interpreter, nextStep);
    }
    execute() {
        var _a;
        this.log();
        // Capture the left node
        let lnode = (_a = this.nextStep) === null || _a === void 0 ? void 0 : _a.execute();
        // Loop while there are more assignments
        if (this.interpreter.match("LPAREN")) {
            // Fetch the operator and right node
            const argNodes = [];
            while (!this.interpreter.isEOF() && !this.interpreter.match("RPAREN")) {
                let argNode = this.interpreter.parseExpression();
                argNodes.push(argNode);
                console.log(argNode);
                if (this.interpreter.match("COMMA")) {
                    continue;
                }
            }
            lnode = {
                type: "FunctionCall",
                left: lnode,
                arguments: argNodes
            };
        }
        return lnode;
    }
}
exports.InterpretFunctionCall = InterpretFunctionCall;
