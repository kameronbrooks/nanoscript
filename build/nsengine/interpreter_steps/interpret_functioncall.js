"use strict";
/**
 * @file interpret_functioncall.ts
 * @description Contains code to interpret a function call
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterpretFunctionCall = void 0;
const interpreter_step_1 = require("./interpreter_step");
class InterpretFunctionCall extends interpreter_step_1.InterpreterStep {
    constructor(interpreter, nextStep = null) {
        super("InterpretFunctionCall", "Interpreting a function call", interpreter, nextStep);
    }
    execute(params) {
        var _a;
        if (this.verboseMode)
            this.log();
        // Capture the left node, if we are not backward looking
        let lnode = (params === null || params === void 0 ? void 0 : params.backwardsLookingNode) || ((_a = this.nextStep) === null || _a === void 0 ? void 0 : _a.execute(params));
        // Loop while there are more assignments
        if (this.interpreter.match("LPAREN")) {
            // Fetch the operator and right node
            const argNodes = [];
            //console.log("params");
            //console.log(params);
            while (!this.interpreter.isEOF() && !this.interpreter.match("RPAREN")) {
                let argNode = this.interpreter.parseExpression(Object.assign(Object.assign({}, params), { returnFunctionCalls: true }));
                argNodes.push(argNode);
                if (this.interpreter.match("COMMA")) {
                    continue;
                }
            }
            lnode = {
                type: "FunctionCall",
                left: lnode,
                arguments: argNodes,
                requireReturn: (params === null || params === void 0 ? void 0 : params.returnFunctionCalls) || false
            };
            if (this.interpreter.match('EOS')) {
                return lnode;
            }
            // Special case for member access
            let memberAccessNode = this.interpreter.expressionSteps.memberAccess.execute(Object.assign(Object.assign({}, params), { backwardsLookingNode: lnode }));
            if (memberAccessNode) {
                lnode = memberAccessNode;
            }
            // Special case for indexer
            let indexerNode = this.interpreter.expressionSteps.indexer.execute(Object.assign(Object.assign({}, params), { backwardsLookingNode: lnode }));
            if (indexerNode) {
                lnode = indexerNode;
            }
        }
        return lnode;
    }
}
exports.InterpretFunctionCall = InterpretFunctionCall;
