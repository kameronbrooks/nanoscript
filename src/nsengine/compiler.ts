/**
 * @file compiler.ts
 * @description This file contains the compiler class which is used to compile the AST into a program
 */

import * as ast from "./ast";
import { Nenv } from "./nenv";
import * as prg from "./program";
import { IObjectGenerator } from "../utilities/object_generator";
import { DType } from "./dtypes/dtype";


export const COMPILER_VERSION = "0.0.8";


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
    compiler: Compiler;

    constructor(compiler: Compiler, parent: Scope | null = null, nenv?: Nenv) {
        this.nenv = nenv;
        this.parent = parent;
        this.objects = new Map();
        this.compiler = compiler;
    }

    createChild() {
        return new Scope(this.compiler, this, undefined);
    }

    getFrameVariables() {
        return this.compiler.state.frameVariableListStack.at(-1) as FrameVariableList;
    }

    doesObjectExist(name: string) : boolean {
        if (this.objects.has(name)) {
            return true;
        }
        else if (this.parent) {
            return this.parent.doesObjectExist(name);
        }
        else if (this.nenv) {
            return this.nenv.hasObject(name);
        }
        return false;
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

    addLocalVariable(name: string, isConst:boolean, datatype: string, value: any, localStackIndex?: number) {
        /*
        if (this.objects.has(name) || this.getFrameVariables().variables.includes(name)) {
            throw new Error(`Variable ${name} already exists`);
        }
        */
        if (this.doesObjectExist(name)) {
            throw new Error(`Variable ${name} already exists`);
        }
        const obj = {
            name,
            datatype,
            value,
            type: isConst ? "constant" : "variable",
            location: "internal",
            localStackIndex: localStackIndex || (this.getFrameVariables().variables.length),
        } as ScopeObject;

        this.objects.set(name, obj);
        this.getFrameVariables().variables.push(name);

        return obj;
    }

    addFunction(name: string, datatype: string, value: any) {
        if (this.doesObjectExist(name)) {
            throw new Error(`Variable ${name} already exists`);
        }
        const obj = {
            name,
            datatype,
            value,
            type: "function",
            location: "internal"
        } as ScopeObject;

        this.objects.set(name, obj);
        this.getFrameVariables().variables.push(name);

        return obj;
    }

    addFunctionArgument(name: string, isConst:boolean, datatype: string, value: any, localStackIndex: number) {
        if (this.objects.has(name)) {
            throw new Error(`Variable ${name} already exists`);
        }
        const obj = {
            name,
            datatype,
            value,
            type: isConst ? "constant" : "variable",
            location: "internal",
            localStackIndex: localStackIndex,
        } as ScopeObject;

        this.objects.set(name, obj);

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
 * Constains the continue instructions within a block
 * Used as an intermediate step in the compilation process to hold references to
 * the continue instructions that need to be updated after the block is compiled
 */
interface ContinueList {
    continueInstructions: prg.Instruction[];
}

/**
 * Contains the instructions for a function
 * - instructions: The instructions for the function
 */
interface FunctionInstructionBuffer {
    instructions: prg.Instruction[];
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
    continueListStack: ContinueList[];
    frameVariableListStack: FrameVariableList[] = [];
    isInFunction: number;


    constructor(currentScope?: Scope) {
        this.currentDatatype = 'none';
        this.isLValue = false;
        this.currentScope = currentScope;
        this.breakListStack = [];
        this.continueListStack = [];
        this.frameVariableListStack = [
            {
                variables: []
            } as FrameVariableList
        ];

        this.isInFunction = 0;
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
    open(tag?: string) {
        this.openReference = '$' + (tag || (this.index++));
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

    cancel() {
        this.openReference = null;
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
            console.log(`${key}: ${prg.OP_NAMES[value.opcode]}  index [${value.index}]`);
        }
    }
}

export class Compiler {
    private engineVersion = COMPILER_VERSION;
    private nenv: Nenv;
    private program: prg.Program;
    public state: CompilerState;
    private globalScope: Scope;
    private frameBeginIndex: number[] = [];
    private instructionReferenceTable: InstructionReferenceTable;
    private instructionBufferTarget: prg.Instruction[];
    private functionInstructionBuffers: FunctionInstructionBuffer[] = [];
    private verboseMode: boolean = false;
    


    constructor(nenv: Nenv, params?: {verboseMode?: boolean}) {
        this.nenv = nenv;
        
        this.program = {
            engineVersion: this.engineVersion,
            nenv: this.nenv,
            instructions: [],
        };
        this.globalScope = new Scope(this, null, this.nenv);
        this.state = new CompilerState(this.globalScope);
        this.frameBeginIndex.push(0);
        this.instructionReferenceTable = new InstructionReferenceTable();
        this.instructionBufferTarget = this.program.instructions;

        this.functionInstructionBuffers = [];
        this.verboseMode = params?.verboseMode || false;
    }

    private init() {
        this.program = {
            engineVersion: this.engineVersion,
            nenv: this.nenv,
            instructions: [],
        };
        this.globalScope = new Scope(this, null, this.nenv);
        this.state = new CompilerState(this.globalScope);
        this.frameBeginIndex.push(0);
        this.instructionReferenceTable = new InstructionReferenceTable();
        this.instructionBufferTarget = this.program.instructions;

        this.functionInstructionBuffers = [];
    }

    /**
     * Set the target for the instruction buffer
     * Instructions will be added to this target instead of the main program
     * @param target 
     */
    setInstructionBufferTarget(target: prg.Instruction[]) {
        this.instructionBufferTarget = target;
    }

    /**
     * Clear the instruction buffer target
     * The main program will be set as the target
     */
    clearInstructionBufferTarget() {
        this.instructionBufferTarget = this.program.instructions;
    }

    /**
     * Commit the instruction buffer target to the main program
     * This will add the instructions in the buffer target to the main program
     * and clear the buffer target
     */
    commitInstructionBufferTarget() {
        if (this.instructionBufferTarget !== this.program.instructions) {
            this.program.instructions.push(...this.instructionBufferTarget);
        }
        this.clearInstructionBufferTarget();
    }

    error(message: string) {
        throw new Error(message);
    }

    getTailIndex() {
        return this.instructionBufferTarget.length;
    }


    addInstruction(opcode: number, operand:any = null, ignoreReference = false) {
        const instruction = {
            opcode,
            operand,
            index: this.instructionBufferTarget.length,
        } as prg.Instruction
        this.instructionBufferTarget.push(instruction);
 
        // push the index of the new instruction to the reference table
        // if there is an open reference, this will close it
        if (!ignoreReference && this.instructionReferenceTable.hasOpenReference()) {
            this.instructionReferenceTable.close(instruction);
        }
        return this.instructionBufferTarget.at(-1);
    }
    insertInstruction(index:number, opcode: number, operand:any = null, ignoreReference = false) {
        const instruction = {
            opcode,
            operand,
            index,
        } as prg.Instruction;

        this.instructionBufferTarget.splice(index, 0, instruction);

        // push the index of the new instruction to the reference table
        // if there is an open reference, this will close it
        if (!ignoreReference && this.instructionReferenceTable.hasOpenReference()) {
            this.instructionReferenceTable.close(instruction);
        }

        return this.instructionBufferTarget.at(index);
    }

    replaceLastInstruction(opcode: number, operand:any = null) {
        const lastInstruction = this.instructionBufferTarget.at(-1);
        if (!lastInstruction) {
            throw new Error("No instructions");
        }
        lastInstruction.opcode = opcode;
        lastInstruction.operand = operand || lastInstruction.operand;
    }

    getLastInstruction() {
        return this.instructionBufferTarget.at(-1);
    }

    getDataType(name: string) : DType {
        return this.nenv.getDataType(name);
    }

    getState() {
        return this.state;
    }

    compile(ast: ast.ASTNode[]) {

        this.init();

        this.instructionBufferTarget = this.program.instructions;

        for (let node of ast) {
            this.compileNode(node);
        }

        // Terminate the program
        const lastInstruction = this.program.instructions.at(-1);
        if (!lastInstruction || lastInstruction.opcode !== prg.OP_TERM) {
            this.addInstruction(prg.OP_TERM);
        }
        
        if (this.verboseMode) {
            console.log("=====================================");
            console.log("Pre Linked Program");
            this.instructionReferenceTable.print();
            prg.printProgram(this.program); 
            console.log("=====================================");
        }
        
        // Optimize the program to remove unnecessary instructions
        this.optimize();

        this.finalize();

        if (this.verboseMode) {
            console.log("=====================================");
            console.log("Final Program");
            this.instructionReferenceTable.print();
            prg.printProgram(this.program); 
            console.log("=====================================");
        }
        // Finalize the program by updating the instruction indices and resolving branch targets
        return this.program;
    }

    optimize() {
        // TODO: Implement optimization
    }
    finalize() {
        
        // Add the function instruction buffers to the main program
        for (let buffer of this.functionInstructionBuffers) {
            this.instructionBufferTarget.push(...buffer.instructions);
        }
        // First, update the instructions to contain the correct indices
        for (let i = 0; i < this.instructionBufferTarget.length; i++) {
            this.instructionBufferTarget[i].index = i;
        }
        // Next, resolve the branch and jump targets
        for (let i = 0; i < this.instructionBufferTarget.length; i++) {
            const instruction = this.instructionBufferTarget[i];
            if (
                instruction.opcode === prg.OP_BRANCH_FALSE || 
                instruction.opcode === prg.OP_BRANCH_TRUE || 
                instruction.opcode === prg.OP_JUMP || 
                instruction.opcode === prg.OP_CALL_INTERNAL
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
        this.instructionBufferTarget = this.instructionBufferTarget.map(instruction => ({
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

            case "Indexer":
                this.compileIndexer(node as ast.IndexerNode);
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

            case "Continue":
                this.compileContinue(node as ast.ContinueNode);
                break;

            case "FunctionDeclaration":
                this.compileFunctionDefinition(node as ast.FunctionDeclarationNode);
                break;

            case "Return":
                this.compileReturn(node as ast.ReturnNode);
                break;

            case "StringBuilder":
                this.compileStringBuilder(node as ast.StringBuilderNode);
                break;

            case "ArrayLiteral":
                this.compileListLiteral(node as ast.ArrayLiteralNode);
                break;

            case "ObjectLiteral":
                this.compileObjectLiteral(node as ast.ObjectLiteralNode);
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
        // This was the old way of doing it
        /*
        const opKey = leftDataType + node.operator + rightDataType;
        const result = prg.searchOpMap(opKey);
        if (!result) {
            throw new Error(`Unknown operator: ${opKey}`);
        }

        // Add the instruction
        this.addInstruction(result.opcode, null)
        */

        const opKey = leftDataType + node.operator + rightDataType;
        const typeOperation = this.getDataType(leftDataType).getOperation(opKey);
        if (!typeOperation) {
            throw new Error(`Unknown operator: ${opKey}`);
        }
        
        const resultDataType = typeOperation(this);

        this.state.currentDatatype = resultDataType.datatype;
        this.state.isLValue = resultDataType.lvalue;
    }

    private compileUnaryOp(node: ast.UnaryOpNode) {
        this.compileNode(node.operand);
        const datatype = this.state.currentDatatype;
        const opKey = node.postfix ? datatype + node.operator: node.operator + datatype;
        //const result = prg.searchOpMap(opKey);
        const typeOperation = this.getDataType(datatype).getOperation(opKey);
        
        if (!typeOperation) {
            throw new Error(`Unknown operator: ${opKey}`);
        }
        console.log("opkey", opKey);    
        const result = typeOperation(this);

        // if this is a post increment or decrement, we need to change the last instruction
        // need to add cases for member access and element access
        /*
        if (result.opcode == prg.OP_INCREMENT_LOCAL32 || result.opcode == prg.OP_DECREMENT_LOCAL32) {
            const lastInstruction = this.instructionBufferTarget.at(-1);
            if (!lastInstruction) {
                throw new Error("There is no lvalue");
            }
            lastInstruction.opcode = result.opcode;
        } else {
            // Add the instruction
            this.addInstruction(result.opcode);
        }
        */
        this.state.currentDatatype = result.datatype;
        this.state.isLValue = result.lvalue;
    }

    private compileBoolean(node: ast.BooleanNode) {
        this.addInstruction(prg.OP_LOAD_LITERAL_BOOL, node.value);
        this.state.currentDatatype = 'bool';
        this.state.isLValue = false;
    }

    private compileNumber(node: ast.NumberNode) {
        // Float
        if (node.dtype === 'float') {
            this.addInstruction(prg.OP_LOAD_LITERAL_FLOAT64, node.value);
        }
        // Int
        else if (node.dtype === 'int') {
            this.addInstruction(prg.OP_LOAD_LITERAL_INT32, node.value);
        }
        // Set the current datatype
        this.state.currentDatatype = node.dtype || 'float';
        this.state.isLValue = false;
    }

    private compileString(node: ast.StringNode) {
        this.addInstruction(prg.OP_LOAD_LITERAL_STRING, node.value);
        this.state.currentDatatype = 'string';
        this.state.isLValue = false;
    }

    private compileStringBuilder(node: ast.StringBuilderNode) {
        // get reversed expression list 
        let reversedExpressions = node.expressions.slice().reverse();
        for (let expression of reversedExpressions) {
            this.compileNode(expression);
        }
        this.addInstruction(prg.OP_LOAD_LITERAL_STRING, node.string);
        this.addInstruction(prg.OP_SB_REPLACE_s, reversedExpressions.length);
        
        this.state.currentDatatype = 'string';
        this.state.isLValue = false;
    }

    private compileNull(node: ast.NullNode) {
        this.addInstruction(prg.OP_LOAD_LITERAL_NULL, null);

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
        // TODO: figure out the opcode based on the object type
        this.addInstruction(prg.OP_LOAD_MEMBER32, (node.member as ast.IdentifierNode).value);
        this.state.currentDatatype = 'any';
        this.state.isLValue = true;
        // Add the instruction
    }

    private compileIndexer(node: ast.IndexerNode) {

        if (!node.object) {
            throw new Error("Missing object in indexer");
        }
        if (!node.indices) {
            throw new Error("Missing indices in indexer");
        }
        // Compile the object
        this.compileNode(node.object);

        // Compile the indices
        for (let index of node.indices) {
            this.compileNode(index);
        }

        // Add the instruction
        this.addInstruction(prg.OP_LOAD_ELEMENT32, node.indices.length);
        this.state.currentDatatype = 'any';
        this.state.isLValue = true;
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
                // Handle variables and consts
                if (target.type == "variable" || target.type == "constant") {
                    const datatype = this.getDataType(target.datatype);

                    // The datatype should be any if not already defined
                    if (!datatype) {
                        throw new Error(`Unknown datatype: ${target.datatype}`);
                    }
                    // Get the load_local operation from the datatype
                    let typeOperation = datatype.getOperation("load_local");
                    if (!typeOperation) {
                        throw new Error(`Unknown operator: load_local ${target.datatype}`);
                    }

                    const result = typeOperation(this, {operand: target.localStackIndex});

                    this.state.currentDatatype = result.datatype;
                    this.state.isLValue = (target.type != "constant");

                }
                else if (target.type == "function") {
                    //this.addInstruction(prg.OP_LOAD_EXTERNAL, target.value);
                    this.addInstruction(prg.OP_LOAD_INSTRUCTION_REFERENCE, '$'+target.name);
                    this.state.isLValue = true;

                    this.state.currentDatatype = target.datatype;
                }

                /*
                if (target.type === "variable") {
                    this.addInstruction(prg.OP_LOAD_LOCAL32, target.localStackIndex);
                    this.state.isLValue = true;
                }
                else if (target.type === "constant") {
                    // TODO: Figure out the opcode based on the datatype
                    this.addInstruction(prg.OP_LOAD_LOCAL32, target.localStackIndex);
                    this.state.isLValue = false;
                }
                else if (target.type === "function") {
                    //this.addInstruction(prg.OP_LOAD_EXTERNAL, target.value);
                    this.addInstruction(prg.OP_LOAD_INSTRUCTION_REFERENCE, '$'+target.name);
                    this.state.isLValue = true;

                }

                this.state.currentDatatype = target.datatype;
                */
            }
        } else {
            // Add the instruction
            // TODO: figure out the opcode based on the object type
            this.addInstruction(prg.OP_LOAD_MEMBER32, node.value);
            this.state.isLValue = true;
        }

        
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
            elseJumpInstruction = this.addInstruction(prg.OP_JUMP, null);
            falseBranchRef = this.instructionReferenceTable.open();
            this.compileNode(node.elseBody);
        }
        // If this is a multi-condition statement, we need to close the reference
        // The reference might already be open. Make sure to use the open one if it is
        const endOfConditionRef = this.instructionReferenceTable.getOpenReference() || this.instructionReferenceTable.open();

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
        let rightDataType = this.state.currentDatatype;

        this.compileNode(node.left);
        if (!this.state.isLValue) {
            throw new Error("Invalid assignment target");
        }
        let leftDataType = this.state.currentDatatype;

        const lastInstruction = this.instructionBufferTarget.at(-1);
        if (!lastInstruction) {
            throw new Error("No instructions");
        }

        // Check for type mismatch
        // TODO: Implement type coercion
        if(leftDataType==='any' || rightDataType==='any') {
            rightDataType = leftDataType = 'any';
        }
        if (leftDataType !== rightDataType) {
            throw new Error(`Type mismatch: ${leftDataType} and ${rightDataType}`);
        }

        const opKey = leftDataType + node.operator + rightDataType;

        const typeOperation = this.getDataType(leftDataType).getOperation(opKey);
        if (!typeOperation) {
            throw new Error(`Unknown operator: ${opKey}`);
        }

        const result = typeOperation(this);

        this.state.currentDatatype = result.datatype;
        this.state.isLValue = result.lvalue;

        // Switch the last load instruction to a store instruction
        // TODO: add support for different types of stores/loads 8, 32, 64
        /*
        if (lastInstruction.opcode === prg.OP_LOAD_MEMBER32) {
            lastInstruction.opcode = prg.OP_STORE_MEMBER32;
        }
        else if (lastInstruction.opcode === prg.OP_LOAD_LOCAL32) {
            lastInstruction.opcode = prg.OP_STORE_LOCAL32;
        }
        else if (lastInstruction.opcode === prg.OP_LOAD_ELEMENT32) {
            lastInstruction.opcode = prg.OP_STORE_ELEMENT32;
        }
        this.state.isLValue = false;
        this.state.currentDatatype = rightDataType;
        */
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
        // Insert the instruction to allocate space on the stack ( make sure that this does not close any open instruction refrerences)
        this.insertInstruction(currentFrameStartIndex, prg.OP_ALLOC_STACK, 1, true);
        
        if (node.initializer) {
            this.compileNode(node.initializer);
            // TODO: add support for different types of stores 8, 32, 64
            this.addInstruction(prg.OP_STORE_LOCAL32, obj?.localStackIndex);
            const initializerDataType = this.state.currentDatatype;

            if (node.dtype == 'any') {
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
        const lastInstruction = this.instructionBufferTarget.at(-1);
        if (!lastInstruction) {
            throw new Error("No instructions");
        }

        if (lastInstruction.opcode === prg.OP_LOAD_EXTERNAL  || 
            lastInstruction.opcode === prg.OP_LOAD_MEMBER8   || 
            lastInstruction.opcode === prg.OP_LOAD_MEMBER32  || 
            lastInstruction.opcode === prg.OP_LOAD_MEMBER64  ||
            lastInstruction.opcode === prg.OP_LOAD_ELEMENT8  ||
            lastInstruction.opcode === prg.OP_LOAD_ELEMENT32 ||
            lastInstruction.opcode === prg.OP_LOAD_ELEMENT64
        ) {
            this.addInstruction(prg.OP_CALL_EXTERNAL, node.arguments.length);
        }
        else if (lastInstruction.opcode === prg.OP_LOAD_INSTRUCTION_REFERENCE) {
            this.replaceLastInstruction(prg.OP_CALL_INTERNAL);
        }
        //Clean up the arguments
        this.addInstruction(prg.OP_POP_STACK, node.arguments.length);
        if (node.requireReturn) {
            // Restore the return value
            this.addInstruction(prg.OP_PUSH_RETURN64);
        }
        
        
    }

    private compileFunctionDefinition(node: ast.FunctionDeclarationNode) {
        // Add the function to the scope
        const obj = this.state.currentScope?.addFunction(
            node.name, 
            'any',
            null 
        );

        // Push a new scope for the function
        this.state.pushScope();
        this.state.frameVariableListStack.push({
            variables: []
        } as FrameVariableList);
        // Create a new function instruction buffer and set it as the target
        const functionBuffer = {
            instructions: []
        } as FunctionInstructionBuffer;

        this.state.frameVariableListStack.push({
            variables: []
        });

        this.functionInstructionBuffers.push(functionBuffer);
        this.setInstructionBufferTarget(functionBuffer.instructions);
        this.state.isInFunction++;

        let argStackIndex = -3;
        const reversedArgs = node.arguments.slice().reverse();
        // Add the arguments to the scope
        for (let arg of reversedArgs) {
            this.state.currentScope?.addFunctionArgument(
                (arg as ast.IdentifierNode).value, 
                false, 
                'any', 
                null,
                argStackIndex--
            );
        }
        if (this.instructionReferenceTable.get('$' + node.name)) {
            throw new Error(`Function ${node.name} already exists`);
        }
        this.instructionReferenceTable.open(node.name);
        // Compile the function body
        this.compileNode(node.body);



        this.clearInstructionBufferTarget();
        this.state.popScope();
        this.state.frameVariableListStack.pop();
        this.state.isInFunction--;
    }

    private compileLoopStatement(node: ast.LoopNode) {
        if (!node.condition) {
            throw new Error("Missing condition in while loop");
        }
        if (!node.body) {
            throw new Error("Missing body in while loop");
        }
        // Push a new scope for the loop
        this.state.pushScope();

        // This fixes an issue where the loops dont work if there are at least 2 in a row
        // I have no idea why the reference table has to have the reference closed before the first instruction
        if (this.instructionReferenceTable.hasOpenReference()) {
            this.addInstruction(prg.OP_NOOP);
        }

        // Compile the initializer if there is one (for loop)
        if (node.initializer) {
            this.compileNode(node.initializer);
        }
        const conditionRef = this.instructionReferenceTable.getOpenReference() || this.instructionReferenceTable.open();

        this.compileNode(node.condition);
        const branchInstruction = this.addInstruction(prg.OP_BRANCH_FALSE, null);

        // Push a new break list so break statements can be handled
        this.state.breakListStack.push({ breakInstructions: [] });
        this.state.continueListStack.push({ continueInstructions: [] });

        // Compile the body
        this.compileNode(node.body);
        // Open a reference for the end of the body to close on the next instruction
        const endOfBodyRef = this.instructionReferenceTable.getOpenReference() || this.instructionReferenceTable.open();

        // Compile the increment if there is one (for loop)
        if (node.increment) {
            this.compileNode(node.increment);
        }
        // Jump back to the condition
        this.addInstruction(prg.OP_JUMP, conditionRef);
        // Open a reference for the end of the loop to close on the next instruction
        const endOfLoopRef = this.instructionReferenceTable.getOpenReference() || this.instructionReferenceTable.open();

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

        // Handle the continue statements
        // Retarget the continue instructions to the end of the loop
        const continueList = this.state.continueListStack.pop();
        if (!continueList) {
            throw new Error("Continue list not found");
        }
        for (let instruction of continueList.continueInstructions) {
            instruction.operand = endOfBodyRef;
        }

        // Pop the loop scope
        this.state.popScope();
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

    private compileContinue(node: ast.ContinueNode) {
        // Add the jump instruction
        const instruction = this.addInstruction(prg.OP_JUMP, null);
        if (!instruction) {
            throw new Error("Failed to add break instruction");
        }

        // Add the instruction to the break list
        const continueLevel = node.level;
        if (continueLevel < 0) {
            throw new Error("Continue level must be greater than or equal to 0");
        }
        if (continueLevel > this.state.continueListStack.length) {
            throw new Error(`Cannot continue farther than loop depth, current depth: ${this.state.continueListStack.length} requested depth: ${continueLevel}`);
        }
        const continueList = this.state.continueListStack.at(-continueLevel);
        if (!continueList) {
            throw new Error("Break list not found at this level");
        }
        continueList.continueInstructions.push(instruction);
    }   

    private compileReturn(node: ast.ReturnNode) {
        if (this.state.isInFunction > 0) {
            if (node.value) {
                this.compileNode(node.value);
                if (this.state.currentDatatype === 'bool') {
                    this.addInstruction(prg.OP_STACKPOP_RET8);
                }
                else if (this.state.currentDatatype === 'int') {
                    this.addInstruction(prg.OP_STACKPOP_RET32);
                }
                else if (this.state.currentDatatype === 'float') {
                    this.addInstruction(prg.OP_STACKPOP_RET64);
                }
                else {
                    this.addInstruction(prg.OP_STACKPOP_RET64);
                }
            } else {
                this.addInstruction(prg.OP_STACKPOP_VOID);
            }
        }
        else {
            if (node.value) {
                this.compileNode(node.value);
            }
            // If outside of a function, return exits the program
            this.addInstruction(prg.OP_TERM);
        }
        
    }

    private compileListLiteral(node: ast.ArrayLiteralNode) {
        for (let element of node.elements.slice().reverse()) {
            this.compileNode(element);
        }
        this.addInstruction(prg.OP_LOAD_LITERAL_LIST, node.elements.length);

        this.state.currentDatatype = 'list';
    }

    private compileObjectLiteral(node: ast.ObjectLiteralNode) {
        for (let element of node.properties.slice().reverse()) {
            this.compileNode(element.value);
        }

        const properties = node.properties.map(prop => ({
            name: prop.key,
        }));

        this.addInstruction(prg.OP_LOAD_LITERAL_OBJECT, {
            properties
        } as IObjectGenerator);

        this.state.currentDatatype = 'object';
    }


}