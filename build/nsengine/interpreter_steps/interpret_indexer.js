"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterpretIndexer = void 0;
const interpreter_step_1 = require("./interpreter_step");
class InterpretIndexer extends interpreter_step_1.InterpreterStep {
    constructor(interpreter, nextStep = null) {
        super("InterpretIndexer", "Interpreting indexing", interpreter, nextStep);
    }
    execute(backwardsLookingNode) {
        var _a;
        if (this.verboseMode)
            this.log();
        // Capture the left node
        let lnode = backwardsLookingNode || ((_a = this.nextStep) === null || _a === void 0 ? void 0 : _a.execute());
        // Loop while there are more assignments
        if (this.interpreter.match("LBRACKET")) {
            // Fetch the operator and right node
            const argNodes = [];
            while (!this.interpreter.isEOF() && !this.interpreter.match("RBRACKET")) {
                let argNode = this.interpreter.parseExpression();
                argNodes.push(argNode);
                console.log(argNode);
                if (this.interpreter.match("COMMA")) {
                    continue;
                }
            }
            lnode = {
                type: "Indexer",
                object: lnode,
                indices: argNodes
            };
            // Have to check for EOS here
            if (this.interpreter.match('EOS')) {
                return lnode;
            }
            // Special case for member access
            let memberAccessNode = this.interpreter.expressionSteps.memberAccess.execute(lnode);
            if (memberAccessNode) {
                lnode = memberAccessNode;
            }
            // Special case for function calls
            let funcCallNode = this.interpreter.expressionSteps.functionCall.execute(lnode);
            if (funcCallNode) {
                lnode = funcCallNode;
            }
        }
        return lnode;
    }
}
exports.InterpretIndexer = InterpretIndexer;
