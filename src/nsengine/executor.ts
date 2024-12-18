
/**
 * Executor.ts
 * 
 * This file contains the Executor class, which is responsible for executing the intermediate code generated by the parser.
 * 
 */

import * as prg from "./program";


class ExternalFunction {
    id: string;
    signature: string;
    callback: Function;

    constructor(id: string, signature: string, callback: Function) {
        this.id = id;
        this.signature = signature;
        this.callback = callback;
    }

    
}

class Interface {
    functions: ExternalFunction[];

    constructor(functions: ExternalFunction[]) {
        this.functions = functions;
    }
}

export class Executor {
    stack: any[] = [];
    heap: any[] = [];
    ip: number = 0;
    sp: number = 0;
    fp: number = 0;
    program?: prg.Program;
    
    constructor(maxStackSize: number = 1024) {

    }

    execute(program: prg.Program) {
        this.program = program;
        this.ip = 0;
        this.fp = 0;
        while (program.instructions[this.ip].opcode != prg.OP_TERM) {
            this.executeInstruction(program.instructions[this.ip]);
        }

        if (this.stack.length > 0) {
            return this.stack.pop();
        }

        return 0;
    }

    executeInstruction(instruction: prg.Instruction) {
        let a, b ,c, d, e, f;
        switch (instruction.opcode) {
            case prg.OP_LOAD_CONST_BOOL:
                this.stack.push(instruction.operand);
                this.ip++;
                this.sp++;
            case prg.OP_LOAD_CONST_INT:
                this.stack.push(instruction.operand);
                this.ip++;
                this.sp++;
                break;
            case prg.OP_LOAD_CONST_FLOAT:
                this.stack.push(instruction.operand);
                this.ip++;
                this.sp++;
                break;
            case prg.OP_LOAD_CONST_STRING:
                this.stack.push(instruction.operand);
                this.ip++;
                this.sp++;
                break;
            case prg.OP_LOAD_CONST_NULL:
                this.stack.push(null);
                this.ip++;
                this.sp++;
                break;
            case prg.OP_ADDi:
                b = this.stack.pop();
                a = this.stack.pop();
                this.stack.push(a + b);
                this.ip++;
                break;
            case prg.OP_ADDf:
                b = this.stack.pop();
                a = this.stack.pop();
                this.stack.push(a + b);
                this.ip++;
                break;
            case prg.OP_SUBi:
                b = this.stack.pop();
                a = this.stack.pop();
                this.stack.push(a - b);
                this.ip++;
                break;
            case prg.OP_SUBf:
                b = this.stack.pop();
                a = this.stack.pop();
                this.stack.push(a - b);
                this.ip++;
                break;
            case prg.OP_MULi:
                b = this.stack.pop();
                a = this.stack.pop();
                this.stack.push(a * b);
                this.ip++;
                break;
            case prg.OP_MULf:
                b = this.stack.pop();
                a = this.stack.pop();
                this.stack.push(a * b);
                this.ip++;
                break;
            case prg.OP_DIVi:
                b = this.stack.pop();
                a = this.stack.pop();
                this.stack.push(a / b);
                this.ip++;
                break;
            case prg.OP_DIVf:
                b = this.stack.pop();
                a = this.stack.pop();
                this.stack.push(a / b);
                this.ip++;
                break;
            case prg.OP_MODi:
                b = this.stack.pop();
                a = this.stack.pop();
                this.stack.push(a % b);
                this.ip++;
                break;
            case prg.OP_MODf:
                b = this.stack.pop();
                a = this.stack.pop();
                this.stack.push(a % b);
                this.ip++;
                break;
            case prg.OP_POWi:
                b = this.stack.pop();
                a = this.stack.pop();
                this.stack.push(a ** b);
                this.ip++;
                break;
            case prg.OP_POWf:
                b = this.stack.pop();
                a = this.stack.pop();
                this.stack.push(a ** b);
                this.ip++;
                break;
            case prg.OP_NEGi:
                a = this.stack.pop();
                this.stack.push(-a);
                this.ip++;
                break;
            case prg.OP_NEGf:
                a = this.stack.pop();
                this.stack.push(-a);
                this.ip++;
                break;
            case prg.OP_INT_TO_FLOAT:
                a = this.stack.pop();
                this.stack.push(a);
                this.ip++;
                break;
            case prg.OP_FLOAT_TO_INT:
                a = this.stack.pop() as number;
                this.stack.push(Math.floor(a));
                this.ip++;
                break;
            case prg.OP_INT_TO_STRING:
                a = this.stack.pop();
                this.stack.push(a.toString());
                this.ip++;
                break;
            case prg.OP_FLOAT_TO_STRING:
                a = this.stack.pop();
                this.stack.push(a.toString());
                this.ip++;
                break;
            case prg.OP_JUMP:
                this.ip = instruction.operand;
                break;
            case prg.OP_BRANCH_FALSE:
                a = this.stack.pop();
                if (!a) {
                    this.ip = instruction.operand;
                } else {
                    this.ip++;
                }
                break;

            

                
            default:
                throw new Error(`Unknown opcode: ${instruction.opcode}`);
        }
        
    }
}