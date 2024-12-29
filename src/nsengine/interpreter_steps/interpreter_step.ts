/**
 * @file interpreter_step.ts
 * @description The base class for all expression interpreter steps
 */
import { Interpreter } from '../interpreter';
import { ASTNode } from '../ast';

export interface InterpreterStepParams {
    returnFunctionCalls?: boolean;      // if any function calls are encountered, they need to return something
    isInFunctionDefinition?: boolean;   // if we are in a function definition
    backwardsLookingNode?: ASTNode;     // the node that we are looking back at
    executeInStatementMode?: boolean;   // if we are executing in statement mode, do not execute next expression if not a match
}

export abstract class InterpreterStep {
    name: string;
    description: string;
    nextStep: InterpreterStep | null;
    interpreter: Interpreter;
    verboseMode: boolean = false;

    constructor(name: string, description: string, interpreter: Interpreter, nextStep: InterpreterStep | null = null) {
        this.name = name;
        this.description = description;
        this.nextStep = nextStep;
        this.interpreter = interpreter;
    }

    log(message?: string) {
        if (message == undefined) {
            message = '';
        }
        console.log(`${this.name}: ${message}  : current_token = ${this.interpreter.peek().type} ${this.interpreter.peek()?.value}`);
    }

    execute(params?:InterpreterStepParams): ASTNode | null | undefined {
        this.log();
        return null;
    }
}
export const InterpreterClass = typeof Interpreter;