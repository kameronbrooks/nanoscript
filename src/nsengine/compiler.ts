import * as ast from "./ast";
import { Nenv } from "./nenv";
import * as prg from "./program";



/**
 * Contains information about an object in a scope
 * - name: The name of the object
 * - datatype: The datatype of the object
 * - value: The value of the object
 * - type: The type of the object 
 *      "function" | "object" | "class" | "constant" | "variable"
 */
class ScopeObject {
    name: string;
    datatype: string;
    value: any;
    type: "function" | "object" | "class" | "constant" | "variable";
    location: "internal" | "external";
    localStackIndex?: number;

    constructor(
        name: string, 
        datatype: string, 
        value: any, 
        type: "function" | "object" | "class" | "constant" | "variable",
        location: "internal" | "external",
        localStackIndex?: number
    ) {
        this.name = name;
        this.datatype = datatype;
        this.value = value;
        this.type = type;
        this.location = location;
        this.localStackIndex = localStackIndex;
    }

}


class Scope {
    parent: Scope | null;
    objects: Map<string, ScopeObject>;
    nenv?: Nenv;
    stackVariables: string[] = [];

    constructor(parent: Scope | null = null, nenv?: Nenv, stackVariables?: string[]) {
        this.nenv = nenv;
        this.parent = parent;
        this.objects = new Map();
        this.stackVariables = stackVariables || [];
    }

    getObject(name: string) : ScopeObject | undefined {
        let obj = this.objects.get(name);
        if(obj) {
            return obj;
        }
        if (this.parent) {
            return this.parent.getObject(name);
        }
        if (this.nenv) {
            let ref = this.nenv.getObject(name);
            if (ref) {
                return {
                    name: name,
                    datatype: ref?.datatype || 'any',
                    value: ref.object,
                    type: ref.type,
                    location: "external"
                } as ScopeObject;
            }
        }
        throw new Error(`Unknown identifier: ${name}`);
    }

    addLocalVariable(name: string, isConst:boolean, datatype: string, value: any) {
        if (this.objects.has(name) || this.stackVariables.includes(name)) {
            throw new Error(`Variable ${name} already exists`);
        }
        const obj = {
            name,
            datatype,
            value,
            type: isConst ? "constant" : "variable",
            location: "internal",
            localStackIndex: this.stackVariables.length,
            
        } as ScopeObject;

        this.objects.set(name, obj);
        this.stackVariables.push(name);

        return obj;
    }

    isGlobal() {
        return this.parent === null;
    }
}

class CompilerState {
    currentDatatype: string;
    isLValue: boolean;
    // TODO: need some kind of object here if we are doing member access
    currentScope?: Scope | null;

    constructor(currentScope?: Scope) {
        this.currentDatatype = 'none';
        this.isLValue = false;
        this.currentScope = currentScope;
    }

    pushScope() {
        this.currentScope = new Scope(this.currentScope);
    }
    popScope() {
        if (this.currentScope && !this.currentScope.isGlobal()) {
            this.currentScope = this.currentScope.parent;
        }
    }

}

export class Compiler {
    private engineVersion = "0.0.1";
    private nenv: Nenv;
    private program: prg.Program;
    private state: CompilerState;
    private globalScope: Scope;
    private frameBeginIndex: number[] = [];


    constructor(nenv: Nenv) {
        this.nenv = nenv;
        
        this.program = {
            engineVersion: this.engineVersion,
            nenv: this.nenv,
            instructions: [],
        };
        this.globalScope = new Scope(null, nenv);
        this.state = new CompilerState(this.globalScope);
        this.frameBeginIndex.push(0);

    }

    getTailIndex() {
        return this.program.instructions.length;
    }


    addInstruction(opcode: number, operand:any = null) {
        
        this.program.instructions.push({
            opcode,
            operand
        });
        return this.program.instructions.at(-1);
    }
    insertInstruction(index:number, opcode: number, operand:any = null) {
        
        this.program.instructions.splice(index, 0, {
            opcode,
            operand
        });
        return this.program.instructions.at(index);
    }

    compile(ast: ast.ASTNode[]) {
        this.program = {
            engineVersion: this.engineVersion,
            nenv: this.nenv,
            instructions: [],
        };

        for (let node of ast) {
            this.compileNode(node);
        }

        // Terminate the program
        this.addInstruction(prg.OP_TERM);

        return this.program;
    }

    compileNode(node: ast.ASTNode) {
        switch (node.type) {
            case "Assignment":
                this.compileAssignment(node as ast.AssignmentNode);
                break;
            case "BinaryOp":
                this.compileBinaryOp(node as ast.BinaryOpNode);
                break;
            case "UnaryOp":
                this.compileUnaryOp(node as ast.UnaryOpNode);
                break;
            case "Boolean":
                this.compileBoolean(node as ast.BooleanNode);
                break;
            case "Number":
                this.compileNumber(node as ast.NumberNode);
                break;
            case "String":
                this.compileString(node as ast.StringNode);
                break;
            case "Null":
                this.compileNull(node as ast.NullNode);
                break;
            case "Identifier":
                this.compileIdentifier(node as ast.IdentifierNode);
                break;
            case "Block":
                this.state.pushScope();
                for (let statement of (node as ast.BlockNode).statements) {
                    this.compileNode(statement);
                }
                this.state.popScope();
                break;
            case "Condition":
                this.compileCondition(node as ast.ConditionNode);
                break;
            case "MemberAccess":
                this.compileMemberAccess(node as ast.MemberAccessNode);
                break;
            case "Declaration":
                this.compileDeclaration(node as ast.DeclarationNode);
                break;
                
            default:
                throw new Error(`Unknown node type: ${node.type}`);
        }
    }

    private compileBinaryOp(node: ast.BinaryOpNode) {
        const rightInsertionIndex = this.getTailIndex();
        this.compileNode(node.right);
        const rightDataType = this.state.currentDatatype;

        const leftInsertionIndex = this.getTailIndex();
        this.compileNode(node.left);
        const leftDataType = this.state.currentDatatype;

        // Check for type mismatch
        // TODO: Implement type coercion
        if (leftDataType !== rightDataType) {
            throw new Error(`Type mismatch: ${leftDataType} and ${rightDataType}`);
        }

        // Look up the opcode based on the left and right datatypes
        const opKey = leftDataType + node.operator + rightDataType;
        const result = prg.searchOpMap(opKey);
        if (!result) {
            throw new Error(`Unknown operator: ${opKey}`);
        }

        // Add the instruction
        this.addInstruction(result.opcode, null);
        this.state.currentDatatype = result.returnDtype;

    }

    private compileUnaryOp(node: ast.UnaryOpNode) {
        this.compileNode(node.operand);
        const datatype = this.state.currentDatatype;

        const opKey = node.postfix ? datatype + node.operator: node.operator + datatype;
        const result = prg.searchOpMap(opKey);
        if (!result) {
            throw new Error(`Unknown operator: ${opKey}`);
        }

        // Add the instruction
        this.addInstruction(result.opcode);
        this.state.currentDatatype = result.returnDtype;
    }

    private compileBoolean(node: ast.BooleanNode) {
        this.addInstruction(prg.OP_LOAD_CONST_BOOL, node.value);
        this.state.currentDatatype = 'bool';
    }

    private compileNumber(node: ast.NumberNode) {
        // Float
        if (node.dtype === 'float') {
            this.addInstruction(prg.OP_LOAD_CONST_FLOAT, node.value);
        }
        // Int
        else if (node.dtype === 'int') {
            this.addInstruction(prg.OP_LOAD_CONST_INT, node.value);
        }
        // Set the current datatype
        this.state.currentDatatype = node.dtype || 'float';
    }

    private compileString(node: ast.StringNode) {
        this.addInstruction(prg.OP_LOAD_CONST_STRING, node.value);
        this.state.currentDatatype = 'string';
    }

    private compileNull(node: ast.NullNode) {
        this.addInstruction(prg.OP_LOAD_CONST_NULL, null);

        this.state.currentDatatype = 'null';
    }

    private compileMemberAccess(node: ast.MemberAccessNode) {
        if (!node.object) {
            throw new Error("Missing object in member access");
        }
        if (!node.member) {
            throw new Error("Missing member in member access");
        }
        console.log(node.object);
        console.log(node.member);
        // Compile the object
        this.compileNode(node.object);

        // Compile the member
        this.addInstruction(prg.OP_LOAD_MEMBER, (node.member as ast.IdentifierNode).value);

        // Add the instruction
    }

    private compileIdentifier(node: ast.IdentifierNode, isMember = false) {
        // check if the identifier is a member of an object
        // if not, we need to check if the identifier is in the current scope
        if (!isMember) {
            let target = this.state.currentScope?.getObject(node.value);
            
            if (!target) {
                throw new Error(`Unknown identifier: ${node.value}`);
            }

            if (target.location === "external") {
                // Add the instruction to load the external object
                this.addInstruction(prg.OP_LOAD_EXTERNAL, target.value);
            }
            else {
                // Add the instruction to load the object
                if (target.type === "variable") {
                    this.addInstruction(prg.OP_LOAD_LOCAL, target.localStackIndex);
                }
                else if (target.type === "constant") {
                    // TODO: Figure out the opcode based on the datatype
                    this.addInstruction(prg.OP_LOAD_CONST_FLOAT, target.localStackIndex);
                }
            }
        } else {
            // Add the instruction
            this.addInstruction(prg.OP_LOAD_MEMBER, node.value);
        }

        
        
        // Load the value
        // TODO: Figure out the opcode based on the object type
        // Also figure out if this should be a load or a store
        
    }

    private compileCondition(node: ast.ConditionNode) {
        this.compileNode(node.condition);
        const conditionIndex = this.getTailIndex();

        // Add a placeholder for the jump instruction
        const branchInstruction = this.addInstruction(prg.OP_BRANCH_FALSE, null);
        const jumpIndex = this.getTailIndex();

        if(node.body) {
            this.compileNode(node.body);
        }
        const falseBranchIndex = this.getTailIndex();
        
        let elseJumpInstruction = null;
        if(node.elseBody) {
            elseJumpInstruction = this.addInstruction(prg.OP_JUMP, null);
            this.compileNode(node.elseBody);
        }
        const endOfConditionIndex = this.getTailIndex();

        // Update the branch instruction
        if (!branchInstruction) {
            throw new Error("Branch instruction not found");
        }

        branchInstruction.operand = falseBranchIndex;

        // Update the jump instruction
        if (elseJumpInstruction) {
            elseJumpInstruction.operand = endOfConditionIndex;
        }
    }


    private compileAssignment(node: ast.AssignmentNode) {
        
        this.compileNode(node.right);
        const rightDataType = this.state.currentDatatype;

        this.compileNode(node.left);
        if (!this.state.isLValue) {
            throw new Error("Invalid assignment target");
        }
        const leftDataType = this.state.currentDatatype;

        // Switch the last load instruction to a store instruction
        if (this.program.instructions.at(-1)?.opcode === prg.OP_LOAD_MEMBER) {
            this.addInstruction(prg.OP_STORE_MEMBER);
        }
        else if (this.program.instructions.at(-1)?.opcode === prg.OP_LOAD_LOCAL) {
            this.addInstruction(prg.OP_STORE_LOCAL);
        }
        else if (this.program.instructions.at(-1)?.opcode === prg.OP_LOAD_ELEMENT) {
            this.addInstruction(prg.OP_STORE_ELEMENT);
        }
    }

    private compileDeclaration(node: ast.DeclarationNode) {
        // If global, this will be 0
        // Otherwise if we are calling this from a function, this will be the index of the frame
        // When a function is called, you want the frame ptr to add the local variables to the stack
        const currentFrameStartIndex = this.frameBeginIndex.at(-1) || 0;
        // Add the constant to the scope
        const obj = this.state.currentScope?.addLocalVariable(
            node.identifier, 
            node.constant || false, 
            node.dtype || 'any', 
            node.initializer
        );
        this.insertInstruction(currentFrameStartIndex, prg.OP_ALLOC_STACK, 1);

        if (node.initializer) {
            this.compileNode(node.initializer);
            this.addInstruction(prg.OP_STORE_LOCAL, obj?.localStackIndex);
        }
        


    }


}