import { Interpreter } from '../interpreter';
import { ASTNode } from '../ast';

export abstract class InterpreterStep {
    name: string;
    description: string;
    nextStep: InterpreterStep | null;
    interpreter: Interpreter;

    constructor(name: string, description: string, interpreter: Interpreter, nextStep: InterpreterStep | null = null) {
        this.name = name;
        this.description = description;
        this.nextStep = nextStep;
        this.interpreter = interpreter;
    }

    execute(): ASTNode | null {
        return null;
    }
}
export const InterpreterClass = typeof Interpreter;