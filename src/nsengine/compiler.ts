import * as ast from "./ast";
import { Nenv } from "./nenv";
import * as prg from "./program";



/**
 * Contains the list of variables in a frame
 * Related to scope but not 1-to-1
 * When entering a function body, different variables are in the frame
 * This allows the local variables to be manipulated based on their offset
 * from the frame pointer
 * 
 * A function may have several scopes, but only one frame
 * - variables: The list of variables in the frame
 */
interface FrameVariableList {
    variables: string[];
}

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
    frameVariablesStack: FrameVariableList[] = [];

    constructor(parent: Scope | null = null, nenv?: Nenv, stackVariables?: FrameVariableList[]) {
        this.nenv = nenv;
        this.parent = parent;
        this.objects = new Map();
        this.frameVariablesStack = stackVariables || [];
    }

    createChild() {
        return new Scope(this, undefined, this.frameVariablesStack);
    }

    getFrameVariables() {
        return this.frameVariablesStack.at(-1) as FrameVariableList;
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
        if (this.objects.has(name) || this.getFrameVariables().variables.includes(name)) {
            throw new Error(`Variable ${name} already exists`);
        }
        const obj = {
            name,
            datatype,
            value,
            type: isConst ? "constant" : "variable",
            location: "internal",
            localStackIndex: this.getFrameVariables().variables.length,
        } as ScopeObject;

        this.objects.set(name, obj);
        this.getFrameVariables().variables.push(name);

        return obj;
    }

    isGlobal() {
        return this.parent === null;
    }
}

/**
 * Contains the break instructions within a block
 * Used as an intermediate step in the compilation process to hold references to 
 * the break instructions that need to be updated after the block is compiled
 * - breakInstructions: The break instructions within the block
 */
interface BreakList {
    breakInstructions: prg.Instruction[];
}



/**
 * Contains the current state of the compiler
 * - currentDatatype: The current datatype
 * - isLValue: Whether the current object is an lvalue
 * - currentScope: The current scope
 * - breakListStack: The break instruction stack
 */
class CompilerState {
    currentDatatype: string;
    isLValue: boolean;
    // TODO: need some kind of object here if we are doing member access
    currentScope?: Scope | null;
    breakListStack: BreakList[];
    frameVariableList: FrameVariableList[] = [];


    constructor(currentScope?: Scope) {
        this.currentDatatype = 'none';
        this.isLValue = false;
        this.currentScope = currentScope;
        this.breakListStack = [];
        this.frameVariableList = [
            {
                variables: []
            } as FrameVariableList
        ];

        if (this.currentScope) {
            this.currentScope.frameVariablesStack = this.frameVariableList;
        }
        console.log(this.currentScope);
    }

    pushScope() {
        if (!this.currentScope) {
            throw new Error("No scope to push");
        }
        this.currentScope = this.currentScope.createChild();
    }
    popScope() {
        if (this.currentScope && !this.currentScope.isGlobal()) {
            this.currentScope = this.currentScope.parent;
        }
    }

}

/**
 * Contains a table of instruction references
 * This is required to handle forward references and allow for the order of instructions
 * to be changed while mainting links between instructions
 * 
 */
class InstructionReferenceTable {
    private table: Map<string, prg.Instruction>;
    private index: number = 0;
    private openReference?: string|null;

    constructor() {
        this.table = new Map();
        this.openReference = null;
        this.index = 0;
    }
    /**
     * Add an instruction to the table
     * @param index 
     * @param instruction 
     */
    add(index: string, instruction: prg.Instruction) {
        this.table.set(index, instruction);
    }

    /**
     * Get an instruction from the table
     * @param index 
     * @returns 
     */
    get(index: string) {
        return this.table.get(index);
    }

    /**
     * Set the open reference
     * This gets the program ready to assign the next instruction to the open reference
     * @param index
     * @returns
     */
    open() {
        this.openReference = '$' + (this.index++);
        return this.openReference;
    }

    /**
     * This closes the open reference and assigns the instruction to the reference
     * @param instruction 
     */
    close(instruction: prg.Instruction) {
        if (this.openReference) {
            this.add(this.openReference, instruction);
            this.openReference = null;
        }
    }

    getOpenReference() {
        return this.openReference;
    }

    hasOpenReference() {
        return this.openReference !== null;
    }

    print() {
        console.log("Instruction Reference Table");
        for (let [key, value] of this.table) {
            console.log(`${key}: ${value.opcode}  index [${value.index}]`);
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
    private instructionReferenceTable: InstructionReferenceTable;


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
        this.instructionReferenceTable = new InstructionReferenceTable();

    }

    getTailIndex() {
        return this.program.instructions.length;
    }


    addInstruction(opcode: number, operand:any = null, ignoreReference = false) {
        const instruction = {
            opcode,
            operand,
            index: this.program.instructions.length,
        } as prg.Instruction
        this.program.instructions.push(instruction);

        // push the index of the new instruction to the reference table
        // if there is an open reference, this will close it
        if (!ignoreReference && this.instructionReferenceTable.hasOpenReference()) {
            this.instructionReferenceTable.close(instruction);
        }
        return this.program.instructions.at(-1);
    }
    insertInstruction(index:number, opcode: number, operand:any = null, ignoreReference = false) {
        const instruction = {
            opcode,
            operand,
            index,
        } as prg.Instruction;

        this.program.instructions.splice(index, 0, instruction);

        // push the index of the new instruction to the reference table
        // if there is an open reference, this will close it
        if (!ignoreReference && this.instructionReferenceTable.hasOpenReference()) {
            this.instructionReferenceTable.close(instruction);
        }

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
        console.log("=====================================");
        console.log("Pre Linked Program");
        this.instructionReferenceTable.print();
        prg.printProgram(this.program); 
        console.log("=====================================");
        // Optimize the program to remove unnecessary instructions
        this.optimize();

        this.finalize();

        console.log("=====================================");
        console.log("Final Program");
        this.instructionReferenceTable.print();
        prg.printProgram(this.program); 
        console.log("=====================================");
        // Finalize the program by updating the instruction indices and resolving branch targets
        return this.program;
    }

    optimize() {
        // TODO: Implement optimization
    }
    finalize() {
        // First, update the instructions to contain the correct indices
        for (let i = 0; i < this.program.instructions.length; i++) {
            this.program.instructions[i].index = i;
        }
        // Next, resolve the branch and jump targets
        for (let i = 0; i < this.program.instructions.length; i++) {
            const instruction = this.program.instructions[i];
            if (
                instruction.opcode === prg.OP_BRANCH_FALSE || 
                instruction.opcode === prg.OP_BRANCH_TRUE || 
                instruction.opcode === prg.OP_JUMP
            ) {
                const targetIndex = instruction.operand as string;
                const targetInstruction = this.instructionReferenceTable.get(targetIndex);
                if (!targetInstruction) {
                    throw new Error(`Branch target not found: ${targetIndex}`);
                }
                instruction.operand = targetInstruction.index;
            }

        }
        // Finally, remove the instruction metadata and return the program
        this.program.instructions = this.program.instructions.map(instruction => ({
            opcode: instruction.opcode,
            operand: instruction.operand
        }));

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
            case "Program":
                for (let statement of (node as ast.BlockNode).statements) {
                    this.compileNode(statement);
                }
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
            case "FunctionCall":
                this.compileFunctionCall(node as ast.FunctionCallNode);
                break;
            case "Loop":
                this.compileLoopStatement(node as ast.LoopNode);
                break;
            case "Break":
                this.compileBreak(node as ast.BreakNode);
                break;
                
            default:
                throw new Error(`Unknown node type: ${node.type}`);
        }
    }

    private compileBinaryOp(node: ast.BinaryOpNode) {
        const leftInsertionIndex = this.getTailIndex();
        this.compileNode(node.left);
        let leftDataType = this.state.currentDatatype;

        const rightInsertionIndex = this.getTailIndex();
        this.compileNode(node.right);
        let rightDataType = this.state.currentDatatype;

        // Check for type mismatch
        // TODO: Implement type coercion
        if(leftDataType==='any' || rightDataType==='any') {
            rightDataType = leftDataType = 'any';
        }
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
        this.state.isLValue = false;
    }

    private compileUnaryOp(node: ast.UnaryOpNode) {
        this.compileNode(node.operand);
        const datatype = this.state.currentDatatype;
        const opKey = node.postfix ? datatype + node.operator: node.operator + datatype;
        const result = prg.searchOpMap(opKey);

        if (!result) {
            throw new Error(`Unknown operator: ${opKey}`);
        }
        // if this is a post increment or decrement, we need to change the last instruction
        // need to add cases for member access and element access
        if (result.opcode == prg.OP_INCREMENT_LOCAL_POST || result.opcode == prg.OP_DECREMENT_LOCAL_POST) {
            const lastInstruction = this.program.instructions.at(-1);
            if (!lastInstruction) {
                throw new Error("There is no lvalue");
            }
            lastInstruction.opcode = result.opcode;
        } else {
            // Add the instruction
            this.addInstruction(result.opcode);
        }

        
        this.state.currentDatatype = result.returnDtype;
    }

    private compileBoolean(node: ast.BooleanNode) {
        this.addInstruction(prg.OP_LOAD_CONST_BOOL, node.value);
        this.state.currentDatatype = 'bool';
        this.state.isLValue = false;
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
        this.state.isLValue = false;
    }

    private compileString(node: ast.StringNode) {
        this.addInstruction(prg.OP_LOAD_CONST_STRING, node.value);
        this.state.currentDatatype = 'string';
        this.state.isLValue = false;
    }

    private compileNull(node: ast.NullNode) {
        this.addInstruction(prg.OP_LOAD_CONST_NULL, null);

        this.state.currentDatatype = 'null';
        this.state.isLValue = false;
    }

    private compileMemberAccess(node: ast.MemberAccessNode) {
        if (!node.object) {
            throw new Error("Missing object in member access");
        }
        if (!node.member) {
            throw new Error("Missing member in member access");
        }
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
                this.state.isLValue = false;
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

                this.state.isLValue = true;
                this.state.currentDatatype = target.datatype;
            }
        } else {
            // Add the instruction
            this.addInstruction(prg.OP_LOAD_MEMBER, node.value);
            this.state.isLValue = true;
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
        let falseBranchRef = null;
        
        let elseJumpInstruction = null;
        if(node.elseBody) {
            elseJumpInstruction = this.addInstruction(prg.OP_JUMP, null, true);
            falseBranchRef = this.instructionReferenceTable.open();
            this.compileNode(node.elseBody);
        }
        const endOfConditionRef = this.instructionReferenceTable.open();

        // Update the branch instruction
        if (!branchInstruction) {
            throw new Error("Branch instruction not found");
        }

        branchInstruction.operand = falseBranchRef || endOfConditionRef;

        // Update the jump instruction
        if (elseJumpInstruction) {
            elseJumpInstruction.operand = endOfConditionRef;
        }
        this.state.isLValue = false;
    }


    private compileAssignment(node: ast.AssignmentNode) {
        
        this.compileNode(node.right);
        const rightDataType = this.state.currentDatatype;

        this.compileNode(node.left);
        if (!this.state.isLValue) {
            throw new Error("Invalid assignment target");
        }
        const leftDataType = this.state.currentDatatype;

        const lastInstruction = this.program.instructions.at(-1);
        if (!lastInstruction) {
            throw new Error("No instructions");
        }
        // Switch the last load instruction to a store instruction
        if (lastInstruction.opcode === prg.OP_LOAD_MEMBER) {
            lastInstruction.opcode = prg.OP_STORE_MEMBER;
        }
        else if (lastInstruction.opcode === prg.OP_LOAD_LOCAL) {
            lastInstruction.opcode = prg.OP_STORE_LOCAL;
        }
        else if (lastInstruction.opcode === prg.OP_LOAD_ELEMENT) {
            lastInstruction.opcode = prg.OP_STORE_ELEMENT;
        }
        this.state.isLValue = false;
        this.state.currentDatatype = rightDataType;
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
            const initializerDataType = this.state.currentDatatype;

            console.log(`initializerDataType: ${initializerDataType} node.dtype: ${node.dtype}`);
            if (node.dtype == 'any') {
                console.log(`Setting datatype to ${initializerDataType}`);
                node.dtype = initializerDataType;
            }
            else if (initializerDataType !== node.dtype) {
                throw new Error(`Type mismatch: ${initializerDataType} and ${node.dtype}`);
            }
        }

    }

    private compileFunctionCall(node: ast.FunctionCallNode) {
        // Compile the arguments
        for (let arg of node.arguments) {
            this.compileNode(arg);
        }

        // Compile the left node
        this.compileNode(node.left);

        // Add the instruction
        this.addInstruction(prg.OP_CALL_EXTERNAL, node.arguments.length);
    }

    private compileLoopStatement(node: ast.LoopNode) {
        if (!node.condition) {
            throw new Error("Missing condition in while loop");
        }
        if (!node.body) {
            throw new Error("Missing body in while loop");
        }
        // Compile the initializer if there is one (for loop)
        if (node.initializer) {
            this.compileNode(node.initializer);
        }
        const conditionRef = this.instructionReferenceTable.open();

        this.compileNode(node.condition);
        const branchInstruction = this.addInstruction(prg.OP_BRANCH_FALSE, null);

        // Push a new break list so break statements can be handled
        this.state.breakListStack.push({ breakInstructions: [] });

        // Compile the body
        this.compileNode(node.body);

        // Compile the increment if there is one (for loop)
        if (node.increment) {
            this.compileNode(node.increment);
        }
        // Jump back to the condition
        this.addInstruction(prg.OP_JUMP, conditionRef);
        const endOfLoopRef = this.instructionReferenceTable.open();


        if (!branchInstruction) {
            throw new Error("Branch instruction not found");
        }
        branchInstruction.operand = endOfLoopRef;

        // Handle the break statements
        // Retarget the break instructions to the end of the loop
        const breakList = this.state.breakListStack.pop();
        if (!breakList) {
            throw new Error("Break list not found");
        }
        for (let instruction of breakList.breakInstructions) {
            instruction.operand = endOfLoopRef;
        }
    }

    private compileBreak(node: ast.BreakNode) {
        // Add the jump instruction
        const instruction = this.addInstruction(prg.OP_JUMP, null);
        if (!instruction) {
            throw new Error("Failed to add break instruction");
        }

        // Add the instruction to the break list
        const breakLevel = node.level;
        if (breakLevel < 0) {
            throw new Error("Break level must be greater than or equal to 0");
        }
        if (breakLevel > this.state.breakListStack.length) {
            throw new Error(`Cannot break out farther than loop depth, current depth: ${this.state.breakListStack.length} requested depth: ${breakLevel}`);
        }
        const breakList = this.state.breakListStack.at(-breakLevel);
        if (!breakList) {
            throw new Error("Break list not found at this level");
        }
        breakList.breakInstructions.push(instruction);
    }


}