"use strict";
/**
 * @file interpret_member_access.ts
 * @description Contains code to interpret member access
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterpretMemberAccess = void 0;
const interpreter_step_1 = require("./interpreter_step");
class InterpretMemberAccess extends interpreter_step_1.InterpreterStep {
    constructor(interpreter, nextStep = null) {
        super("InterpretMemberAccess", "Interpreting member access", interpreter, nextStep);
    }
    execute(params) {
        var _a, _b;
        if (this.verboseMode)
            this.log();
        // Capture the left node
        let lnode = (params === null || params === void 0 ? void 0 : params.backwardsLookingNode) || ((_a = this.nextStep) === null || _a === void 0 ? void 0 : _a.execute(params));
        // Loop while there are more assignments
        while (!this.interpreter.isEOF() && this.interpreter.match("MEMBER_ACCESS")) {
            // Fetch the operator and right node
            const operator = this.interpreter.previous().value;
            const rnode = (_b = this.nextStep) === null || _b === void 0 ? void 0 : _b.execute(Object.assign(Object.assign({}, params), { returnFunctionCalls: true }));
            lnode = {
                type: "MemberAccess",
                object: lnode,
                member: rnode
            };
            // Have to check for EOS here
            if (this.interpreter.match('EOS')) {
                return lnode;
            }
            // Requires a special case for function calls
            let funcCallNode = this.interpreter.expressionSteps.functionCall.execute(Object.assign(Object.assign({}, params), { backwardsLookingNode: lnode }));
            if (funcCallNode) {
                lnode = funcCallNode;
            }
            // Requires a special case for indexer
            let indexerNode = this.interpreter.expressionSteps.indexer.execute(Object.assign(Object.assign({}, params), { backwardsLookingNode: lnode }));
            if (indexerNode) {
                lnode = indexerNode;
            }
        }
        return lnode;
    }
}
exports.InterpretMemberAccess = InterpretMemberAccess;
