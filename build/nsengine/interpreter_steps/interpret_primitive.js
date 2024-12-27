"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterpretPrimitive = void 0;
/**
 * @file interpret_primitive.ts
 * @description Contains code to interpret a primative value (number, boolean, null)
 */
const interpreter_step_1 = require("./interpreter_step");
class InterpretPrimitive extends interpreter_step_1.InterpreterStep {
    constructor(interpreter, nextStep = null) {
        super("InterpretPrimative", "Interpreting a primative value", interpreter, nextStep);
    }
    execute() {
        var _a;
        if (this.verboseMode)
            this.log();
        if (this.interpreter.match("LPAREN")) {
            let node = this.interpreter.parseExpression();
            this.interpreter.consume("RPAREN");
            return node;
        }
        else if (this.interpreter.match("BOOLEAN")) {
            return {
                type: "Boolean",
                value: this.interpreter.previous().value === "true",
                dtype: "bool"
            };
        }
        else if (this.interpreter.match("NUMBER")) {
            const valueStr = this.interpreter.previous().value;
            if (valueStr.includes('.')) {
                return {
                    type: "Number",
                    value: parseFloat(valueStr),
                    dtype: "float"
                };
            }
            else {
                return {
                    type: "Number",
                    value: parseInt(valueStr),
                    dtype: "int"
                };
            }
        }
        else if (this.interpreter.match('NULL')) {
            return {
                type: "Null",
                value: null
            };
        }
        else {
            return (_a = this.nextStep) === null || _a === void 0 ? void 0 : _a.execute();
        }
        return null;
    }
}
exports.InterpretPrimitive = InterpretPrimitive;
