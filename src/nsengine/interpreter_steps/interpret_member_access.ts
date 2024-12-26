import { InterpreterStep } from "./interpreter_step";
import { Interpreter } from "../interpreter";
import { ASTNode, BinaryOpNode, createBinaryOpNode , MemberAccessNode} from "../ast";

export class InterpretMemberAccess extends InterpreterStep {
    constructor(interpreter: Interpreter, nextStep: InterpreterStep | null = null) {
        super("InterpretMemberAccess", "Interpreting member access", interpreter, nextStep);
    }

    execute(backwardLookingNode?: ASTNode) {
        if(this.verboseMode) this.log();
        // Capture the left node
        let lnode = backwardLookingNode || this.nextStep?.execute();

        // Loop while there are more assignments
        while (!this.interpreter.isEOF() && this.interpreter.match("MEMBER_ACCESS")) {
            // Fetch the operator and right node
            const operator = this.interpreter.previous().value;
            const rnode = this.nextStep?.execute();
            
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
            let funcCallNode = this.interpreter.expressionSteps.functionCall.execute(lnode) as ASTNode;
            if (funcCallNode) {
                lnode = funcCallNode;
            }
            // Requires a special case for indexer
            let indexerNode = this.interpreter.expressionSteps.indexer.execute(lnode) as ASTNode;
            if (indexerNode) {
                lnode = indexerNode;
            }

        }

        return lnode;
    }
}