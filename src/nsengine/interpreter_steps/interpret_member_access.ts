import { InterpreterStep } from "./interpreter_step";
import { Interpreter } from "../interpreter";
import { ASTNode, BinaryOpNode, createBinaryOpNode , MemberAccessNode} from "../ast";

export class InterpretMemberAccess extends InterpreterStep {
    constructor(interpreter: Interpreter, nextStep: InterpreterStep | null = null) {
        super("InterpretMemberAccess", "Interpreting member access", interpreter, nextStep);
    }

    execute() {
        this.log();
        // Capture the left node
        let lnode = this.nextStep?.execute();

        // Loop while there are more assignments
        while (!this.interpreter.isEOF() && this.interpreter.match("MEMBER_ACCESS")) {
            // Fetch the operator and right node
            const operator = this.interpreter.previous().value;
            const rnode = this.nextStep?.execute();
            //const rnode = this.interpreter.expressionSteps.functionCall.execute();
            lnode = {
                type: "MemberAccess",
                object: lnode as ASTNode, 
                member: rnode as ASTNode
            } as MemberAccessNode;


            // Requires a special case for function calls
            let funcCallNode = this.interpreter.expressionSteps.functionCall.execute(lnode);
            if (funcCallNode) {
                lnode = funcCallNode;
            }

        }

        return lnode;
    }
}