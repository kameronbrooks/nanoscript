/**
 * @file interpret_indexer.ts
 * @description Contains the code for interpreting an indexer node.
 */
import { InterpreterStep, InterpreterStepParams } from "./interpreter_step";
import { Interpreter } from "../interpreter";
import { ASTNode, IndexerNode} from "../ast";

export class InterpretIndexer extends InterpreterStep {
    constructor(interpreter: Interpreter, nextStep: InterpreterStep | null = null) {
        super("InterpretIndexer", "Interpreting indexing", interpreter, nextStep);
    }

    execute(params?: InterpreterStepParams): ASTNode | null | undefined {
        if(this.verboseMode) this.log();
        // Capture the left node
        let lnode = params?.backwardsLookingNode || this.nextStep?.execute(params);

        // Loop while there are more assignments
        if (this.interpreter.match("LBRACKET")) {
            // Fetch the operator and right node
            const argNodes: ASTNode[] = [];

            while(!this.interpreter.isEOF() && !this.interpreter.match("RBRACKET")) {
                let argNode = this.interpreter.parseExpression();
                argNodes.push(argNode as ASTNode);
                console.log(argNode);
                if (this.interpreter.match("COMMA")) {
                    continue;
                }
            }

            lnode = {
                type: "Indexer",
                object: lnode as ASTNode,
                indices: argNodes
            } as IndexerNode;

            // Have to check for EOS here
            if (this.interpreter.match('EOS')) {
                return lnode;
            }
            
            // Special case for member access
            let memberAccessNode = this.interpreter.expressionSteps.memberAccess.execute({...params, backwardsLookingNode: lnode}) as ASTNode;
            if (memberAccessNode) {
                lnode = memberAccessNode;
            }
            // Special case for function calls
            let funcCallNode = this.interpreter.expressionSteps.functionCall.execute({...params, backwardsLookingNode: lnode}) as ASTNode;
            if (funcCallNode) {
                lnode = funcCallNode;
            }
        }

        return lnode;
    }
}