"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterpreterStep = void 0;
class InterpreterStep {
    constructor(name, description, interpreter) {
        this.name = name;
        this.description = description;
        this.nextStep = null;
        this.interpreter = interpreter;
    }
    execute() {
        return null;
    }
}
exports.InterpreterStep = InterpreterStep;
