/**
 * @file interpret_member_access.ts
 * @description Contains code to interpret member access
 */

import { InterpreterStep, InterpreterStepParams } from "./interpreter_step";
import { Interpreter } from "../interpreter";
import { ASTNode, BinaryOpNode, createBinaryOpNode , MemberAccessNode} from "../ast";

export class InterpretMemberAccess extends InterpreterStep {
    constructor(interpreter: Interpreter, nextStep: InterpreterStep | null = null) {
        super("InterpretMemberAccess", "Interpreting member access", interpreter, nextStep);
    }

    execute(params?: InterpreterStepParams): ASTNode | undefined| null {
        if(this.verboseMode) this.log();

        // Capture the left node
        let lnode = params?.backwardsLookingNode || this.nextStep?.execute(params);

        // Loop while there are more assignments
        while (!this.interpreter.isEOF() && this.interpreter.match("MEMBER_ACCESS")) {
            // Fetch the operator and right node
            const operator = this.interpreter.previous().value;
            const rnode = this.nextStep?.execute({
                ...params,
                returnFunctionCalls: true
            } as InterpreterStepParams);
            
            lnode = {
                type: "MemberAccess",
                object: lnode as ASTNode, 
                member: rnode as ASTNode
            } as MemberAccessNode;

            // Have to check for EOS here
            if (this.interpreter.match('EOS')) {
                return lnode;
            }

            // Requires a special case for function calls
            let funcCallNode = this.interpreter.expressionSteps.functionCall.execute({...params, backwardsLookingNode: lnode}) as ASTNode;
            if (funcCallNode) {
                lnode = funcCallNode;
            }
            // Requires a special case for indexer
            let indexerNode = this.interpreter.expressionSteps.indexer.execute({...params, backwardsLookingNode: lnode}) as ASTNode;
            if (indexerNode) {
                lnode = indexerNode;
            }

        }

        return lnode;
    }
}