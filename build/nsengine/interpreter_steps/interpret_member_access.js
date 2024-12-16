"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterpretMemberAccess = void 0;
const interpreter_step_1 = require("./interpreter_step");
class InterpretMemberAccess extends interpreter_step_1.InterpreterStep {
    constructor(interpreter, nextStep = null) {
        super("InterpretMemberAccess", "Interpreting member access", interpreter, nextStep);
    }
    execute(backwardLookingNode) {
        var _a, _b;
        this.log();
        // Capture the left node
        let lnode = backwardLookingNode || ((_a = this.nextStep) === null || _a === void 0 ? void 0 : _a.execute());
        // Loop while there are more assignments
        while (!this.interpreter.isEOF() && this.interpreter.match("MEMBER_ACCESS")) {
            // Fetch the operator and right node
            const operator = this.interpreter.previous().value;
            const rnode = (_b = this.nextStep) === null || _b === void 0 ? void 0 : _b.execute();
            lnode = {
                type: "MemberAccess",
                object: lnode,
                member: rnode
            };
            // Requires a special case for function calls
            let funcCallNode = this.interpreter.expressionSteps.functionCall.execute(lnode);
            if (funcCallNode) {
                lnode = funcCallNode;
            }
            // Requires a special case for indexer
            let indexerNode = this.interpreter.expressionSteps.indexer.execute(lnode);
            if (indexerNode) {
                lnode = indexerNode;
            }
        }
        return lnode;
    }
}
exports.InterpretMemberAccess = InterpretMemberAccess;
