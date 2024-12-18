import * as ast from "./ast";
import { Nenv } from "./nenv";
import * as prg from "./program";




class ScopeObject {
    name: string;
    datatype: string;
    value: any;
    type: "function" | "object" | "class" | "constant" | "variable";

    constructor(name: string, datatype: string, value: any, type: "function" | "object" | "class" | "constant" | "variable") {
        this.name = name;
        this.datatype = datatype;
        this.value = value;
        this.type = type;
    }

}

class Scope {
    parent: Scope | null;
    objects: Map<string, ScopeObject>;
    nenv?: Nenv;

    constructor(parent: Scope | null = null, nenv?: Nenv) {
        this.nenv = nenv;
        this.parent = parent;
        this.objects = new Map();
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
                    name: ref.export.name,
                    datatype: ref.export.datatype || 'any',
                    value: ref.export.object,
                    type: ref.export.type
                };
            }
        }
        return obj;
    }

    isGlobal() {
        return this.parent === null;
    }
}

class CompilerState {
    currentDatatype: string;
    isLValue: boolean;
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
    private nenv: Nenv;
    private program: prg.Program;
    private state: CompilerState;
    private globalScope: Scope;


    constructor(nenv: Nenv) {
        this.nenv = nenv;
        
        this.program = {
            nenv: this.nenv,
            instructions: [],
        };
        this.globalScope = new Scope(null, nenv);
        this.state = new CompilerState(this.globalScope);

    }

    getTailIndex() {
        return this.program.instructions.length;
    }


    addInstruction(opcode: number, operand:any = null) {
        this.program.instructions.push({
            opcode,
            operand
        });
    }

    compile(ast: ast.ASTNode[]) {
        this.program = {
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

    private compileIdentifier(node: ast.IdentifierNode) {
        let target = this.state.currentScope?.getObject(node.value);
        if (!target) {
            throw new Error(`Unknown identifier: ${node.value}`);
        }
        
        // Load the value
        // TODO: Figure out the opcode based on the object type
        // Also figure out if this should be a load or a store
    }


    private compileAssignment(node: ast.AssignmentNode) {
        this.compileNode(node.right);
        this.compileNode(node.left);
    }

}