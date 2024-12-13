"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterpreterClass = exports.InterpreterStep = void 0;
const interpreter_1 = require("../interpreter");
class InterpreterStep {
    constructor(name, description, interpreter, nextStep = null) {
        this.name = name;
        this.description = description;
        this.nextStep = nextStep;
        this.interpreter = interpreter;
    }
    log(message) {
        if (message == undefined) {
            message = '';
        }
        console.log(`${this.name}: ${message}  : current_token = ${this.interpreter.peek().type}`);
    }
    execute() {
        this.log();
        return null;
    }
}
exports.InterpreterStep = InterpreterStep;
exports.InterpreterClass = typeof interpreter_1.Interpreter;
