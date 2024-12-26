"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Compiler = void 0;
const prg = __importStar(require("./program"));
/**
 * Contains information about an object in a scope
 * - name: The name of the object
 * - datatype: The datatype of the object
 * - value: The value of the object
 * - type: The type of the object
 *      "function" | "object" | "class" | "constant" | "variable"
 */
class ScopeObject {
    constructor(name, datatype, value, type, location, localStackIndex) {
        this.name = name;
        this.datatype = datatype;
        this.value = value;
        this.type = type;
        this.location = location;
        this.localStackIndex = localStackIndex;
    }
}
class Scope {
    constructor(parent = null, nenv, stackVariables) {
        this.frameVariablesStack = [];
        this.nenv = nenv;
        this.parent = parent;
        this.objects = new Map();
        this.frameVariablesStack = stackVariables || [];
    }
    createChild() {
        return new Scope(this, undefined, this.frameVariablesStack);
    }
    getFrameVariables() {
        return this.frameVariablesStack.at(-1);
    }
    getObject(name) {
        let obj = this.objects.get(name);
        if (obj) {
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
                    datatype: (ref === null || ref === void 0 ? void 0 : ref.datatype) || 'any',
                    value: ref.object,
                    type: ref.type,
                    location: "external"
                };
            }
        }
        throw new Error(`Unknown identifier: ${name}`);
    }
    addLocalVariable(name, isConst, datatype, value, localStackIndex) {
        if (this.objects.has(name) || this.getFrameVariables().variables.includes(name)) {
            throw new Error(`Variable ${name} already exists`);
        }
        const obj = {
            name,
            datatype,
            value,
            type: isConst ? "constant" : "variable",
            location: "internal",
            localStackIndex: localStackIndex || (this.getFrameVariables().variables.length),
        };
        this.objects.set(name, obj);
        this.getFrameVariables().variables.push(name);
        return obj;
    }
    addFunction(name, datatype, value) {
        if (this.objects.has(name) || this.getFrameVariables().variables.includes(name)) {
            throw new Error(`Variable ${name} already exists`);
        }
        const obj = {
            name,
            datatype,
            value,
            type: "function",
            location: "internal"
        };
        this.objects.set(name, obj);
        this.getFrameVariables().variables.push(name);
        return obj;
    }
    addFunctionArgument(name, isConst, datatype, value, localStackIndex) {
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
        };
        this.objects.set(name, obj);
        return obj;
    }
    isGlobal() {
        return this.parent === null;
    }
}
/**
 * Contains the current state of the compiler
 * - currentDatatype: The current datatype
 * - isLValue: Whether the current object is an lvalue
 * - currentScope: The current scope
 * - breakListStack: The break instruction stack
 */
class CompilerState {
    constructor(currentScope) {
        this.frameVariableList = [];
        this.currentDatatype = 'none';
        this.isLValue = false;
        this.currentScope = currentScope;
        this.breakListStack = [];
        this.frameVariableList = [
            {
                variables: []
            }
        ];
        if (this.currentScope) {
            this.currentScope.frameVariablesStack = this.frameVariableList;
        }
        this.isInFunction = 0;
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
    constructor() {
        this.index = 0;
        this.table = new Map();
        this.openReference = null;
        this.index = 0;
    }
    /**
     * Add an instruction to the table
     * @param index
     * @param instruction
     */
    add(index, instruction) {
        this.table.set(index, instruction);
    }
    /**
     * Get an instruction from the table
     * @param index
     * @returns
     */
    get(index) {
        return this.table.get(index);
    }
    /**
     * Set the open reference
     * This gets the program ready to assign the next instruction to the open reference
     * @param index
     * @returns
     */
    open(tag) {
        this.openReference = '$' + (tag || (this.index++));
        return this.openReference;
    }
    /**
     * This closes the open reference and assigns the instruction to the reference
     * @param instruction
     */
    close(instruction) {
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
class Compiler {
    constructor(nenv) {
        this.engineVersion = "0.0.1";
        this.frameBeginIndex = [];
        this.functionInstructionBuffers = [];
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
        this.instructionBufferTarget = this.program.instructions;
        this.functionInstructionBuffers = [];
    }
    /**
     * Set the target for the instruction buffer
     * Instructions will be added to this target instead of the main program
     * @param target
     */
    setInstructionBufferTarget(target) {
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
    getTailIndex() {
        return this.instructionBufferTarget.length;
    }
    addInstruction(opcode, operand = null, ignoreReference = false) {
        const instruction = {
            opcode,
            operand,
            index: this.instructionBufferTarget.length,
        };
        this.instructionBufferTarget.push(instruction);
        // push the index of the new instruction to the reference table
        // if there is an open reference, this will close it
        if (!ignoreReference && this.instructionReferenceTable.hasOpenReference()) {
            this.instructionReferenceTable.close(instruction);
        }
        return this.instructionBufferTarget.at(-1);
    }
    insertInstruction(index, opcode, operand = null, ignoreReference = false) {
        const instruction = {
            opcode,
            operand,
            index,
        };
        this.instructionBufferTarget.splice(index, 0, instruction);
        // push the index of the new instruction to the reference table
        // if there is an open reference, this will close it
        if (!ignoreReference && this.instructionReferenceTable.hasOpenReference()) {
            this.instructionReferenceTable.close(instruction);
        }
        return this.instructionBufferTarget.at(index);
    }
    replaceLastInstruction(opcode, operand = null) {
        const lastInstruction = this.instructionBufferTarget.at(-1);
        if (!lastInstruction) {
            throw new Error("No instructions");
        }
        lastInstruction.opcode = opcode;
        lastInstruction.operand = operand || lastInstruction.operand;
    }
    compile(ast) {
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
            if (instruction.opcode === prg.OP_BRANCH_FALSE ||
                instruction.opcode === prg.OP_BRANCH_TRUE ||
                instruction.opcode === prg.OP_JUMP ||
                instruction.opcode === prg.OP_CALL_INTERNAL) {
                const targetIndex = instruction.operand;
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
    compileNode(node) {
        switch (node.type) {
            case "Assignment":
                this.compileAssignment(node);
                break;
            case "BinaryOp":
                this.compileBinaryOp(node);
                break;
            case "UnaryOp":
                this.compileUnaryOp(node);
                break;
            case "Boolean":
                this.compileBoolean(node);
                break;
            case "Number":
                this.compileNumber(node);
                break;
            case "String":
                this.compileString(node);
                break;
            case "Null":
                this.compileNull(node);
                break;
            case "Identifier":
                this.compileIdentifier(node);
                break;
            case "Block":
                this.state.pushScope();
                for (let statement of node.statements) {
                    this.compileNode(statement);
                }
                this.state.popScope();
                break;
            case "Program":
                for (let statement of node.statements) {
                    this.compileNode(statement);
                }
                break;
            case "Condition":
                this.compileCondition(node);
                break;
            case "MemberAccess":
                this.compileMemberAccess(node);
                break;
            case "Declaration":
                this.compileDeclaration(node);
                break;
            case "FunctionCall":
                this.compileFunctionCall(node);
                break;
            case "Loop":
                this.compileLoopStatement(node);
                break;
            case "Break":
                this.compileBreak(node);
                break;
            case "FunctionDeclaration":
                this.compileFunctionDefinition(node);
                break;
            case "Return":
                this.compileReturn(node);
                break;
            default:
                throw new Error(`Unknown node type: ${node.type}`);
        }
    }
    compileBinaryOp(node) {
        const leftInsertionIndex = this.getTailIndex();
        this.compileNode(node.left);
        let leftDataType = this.state.currentDatatype;
        const rightInsertionIndex = this.getTailIndex();
        this.compileNode(node.right);
        let rightDataType = this.state.currentDatatype;
        // Check for type mismatch
        // TODO: Implement type coercion
        if (leftDataType === 'any' || rightDataType === 'any') {
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
    compileUnaryOp(node) {
        this.compileNode(node.operand);
        const datatype = this.state.currentDatatype;
        const opKey = node.postfix ? datatype + node.operator : node.operator + datatype;
        const result = prg.searchOpMap(opKey);
        if (!result) {
            throw new Error(`Unknown operator: ${opKey}`);
        }
        // if this is a post increment or decrement, we need to change the last instruction
        // need to add cases for member access and element access
        if (result.opcode == prg.OP_INCREMENT_LOCAL32 || result.opcode == prg.OP_DECREMENT_LOCAL32) {
            const lastInstruction = this.instructionBufferTarget.at(-1);
            if (!lastInstruction) {
                throw new Error("There is no lvalue");
            }
            lastInstruction.opcode = result.opcode;
        }
        else {
            // Add the instruction
            this.addInstruction(result.opcode);
        }
        this.state.currentDatatype = result.returnDtype;
    }
    compileBoolean(node) {
        this.addInstruction(prg.OP_LOAD_LITERAL_BOOL, node.value);
        this.state.currentDatatype = 'bool';
        this.state.isLValue = false;
    }
    compileNumber(node) {
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
    compileString(node) {
        this.addInstruction(prg.OP_LOAD_LITERAL_STRING, node.value);
        this.state.currentDatatype = 'string';
        this.state.isLValue = false;
    }
    compileNull(node) {
        this.addInstruction(prg.OP_LOAD_LITERAL_NULL, null);
        this.state.currentDatatype = 'null';
        this.state.isLValue = false;
    }
    compileMemberAccess(node) {
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
        this.addInstruction(prg.OP_LOAD_MEMBER32, node.member.value);
        // Add the instruction
    }
    compileIdentifier(node, isMember = false) {
        var _a;
        // check if the identifier is a member of an object
        // if not, we need to check if the identifier is in the current scope
        if (!isMember) {
            let target = (_a = this.state.currentScope) === null || _a === void 0 ? void 0 : _a.getObject(node.value);
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
                // TODO: figure out the opcode based on the object type
                if (target.type === "variable") {
                    this.addInstruction(prg.OP_LOAD_LOCAL32, target.localStackIndex);
                    this.state.isLValue = true;
                }
                else if (target.type === "constant") {
                    // TODO: Figure out the opcode based on the datatype
                    this.addInstruction(prg.OP_LOAD_LITERAL_FLOAT64, target.localStackIndex);
                    this.state.isLValue = false;
                }
                else if (target.type === "function") {
                    //this.addInstruction(prg.OP_LOAD_EXTERNAL, target.value);
                    this.addInstruction(prg.OP_LOAD_INSTRUCTION_REFERENCE, '$' + target.name);
                    this.state.isLValue = true;
                }
                this.state.currentDatatype = target.datatype;
            }
        }
        else {
            // Add the instruction
            // TODO: figure out the opcode based on the object type
            this.addInstruction(prg.OP_LOAD_MEMBER32, node.value);
            this.state.isLValue = true;
        }
    }
    compileCondition(node) {
        this.compileNode(node.condition);
        const conditionIndex = this.getTailIndex();
        // Add a placeholder for the jump instruction
        const branchInstruction = this.addInstruction(prg.OP_BRANCH_FALSE, null);
        const jumpIndex = this.getTailIndex();
        if (node.body) {
            this.compileNode(node.body);
        }
        let falseBranchRef = null;
        let elseJumpInstruction = null;
        if (node.elseBody) {
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
    compileAssignment(node) {
        this.compileNode(node.right);
        const rightDataType = this.state.currentDatatype;
        this.compileNode(node.left);
        if (!this.state.isLValue) {
            throw new Error("Invalid assignment target");
        }
        const leftDataType = this.state.currentDatatype;
        const lastInstruction = this.instructionBufferTarget.at(-1);
        if (!lastInstruction) {
            throw new Error("No instructions");
        }
        // Switch the last load instruction to a store instruction
        // TODO: add support for different types of stores/loads 8, 32, 64
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
    }
    compileDeclaration(node) {
        var _a;
        // If global, this will be 0
        // Otherwise if we are calling this from a function, this will be the index of the frame
        // When a function is called, you want the frame ptr to add the local variables to the stack
        const currentFrameStartIndex = this.frameBeginIndex.at(-1) || 0;
        // Add the constant to the scope
        const obj = (_a = this.state.currentScope) === null || _a === void 0 ? void 0 : _a.addLocalVariable(node.identifier, node.constant || false, node.dtype || 'any', node.initializer);
        this.insertInstruction(currentFrameStartIndex, prg.OP_ALLOC_STACK, 1);
        if (node.initializer) {
            this.compileNode(node.initializer);
            // TODO: add support for different types of stores 8, 32, 64
            this.addInstruction(prg.OP_STORE_LOCAL32, obj === null || obj === void 0 ? void 0 : obj.localStackIndex);
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
    compileFunctionCall(node) {
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
        if (lastInstruction.opcode === prg.OP_LOAD_EXTERNAL) {
            this.addInstruction(prg.OP_CALL_EXTERNAL, node.arguments.length);
        }
        else if (lastInstruction.opcode === prg.OP_LOAD_INSTRUCTION_REFERENCE) {
            this.replaceLastInstruction(prg.OP_CALL_INTERNAL);
        }
        //Clean up the arguments
        this.addInstruction(prg.OP_POP_STACK, node.arguments.length);
        // Restore the return value
        this.addInstruction(prg.OP_PUSH_RETURN64);
    }
    compileFunctionDefinition(node) {
        var _a, _b;
        // Add the function to the scope
        const obj = (_a = this.state.currentScope) === null || _a === void 0 ? void 0 : _a.addFunction(node.name, 'any', null);
        console.log(this.state.currentScope);
        const previousFrameVariableList = this.state.frameVariableList;
        // Push a new scope for the function
        this.state.pushScope();
        this.state.frameVariableList = [];
        // Create a new function instruction buffer and set it as the target
        const functionBuffer = {
            instructions: []
        };
        if (this.state.currentScope) {
            this.state.currentScope.frameVariablesStack = this.state.frameVariableList;
        }
        this.functionInstructionBuffers.push(functionBuffer);
        this.setInstructionBufferTarget(functionBuffer.instructions);
        this.state.isInFunction++;
        let argStackIndex = -3;
        const reversedArgs = node.arguments.slice().reverse();
        // Add the arguments to the scope
        for (let arg of reversedArgs) {
            (_b = this.state.currentScope) === null || _b === void 0 ? void 0 : _b.addFunctionArgument(arg.value, false, 'any', null, argStackIndex--);
        }
        if (this.instructionReferenceTable.get('$' + node.name)) {
            throw new Error(`Function ${node.name} already exists`);
        }
        this.instructionReferenceTable.open(node.name);
        // Compile the function body
        this.compileNode(node.body);
        this.clearInstructionBufferTarget();
        this.state.popScope();
        this.state.frameVariableList = previousFrameVariableList;
        this.state.isInFunction--;
    }
    compileLoopStatement(node) {
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
    compileBreak(node) {
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
    compileReturn(node) {
        if (this.state.isInFunction > 0) {
            if (node.value) {
                this.compileNode(node.value);
                if (this.state.currentDatatype === 'bool') {
                    this.addInstruction(prg.OP_RETURN8);
                }
                else if (this.state.currentDatatype === 'int') {
                    this.addInstruction(prg.OP_RETURN32);
                }
                else if (this.state.currentDatatype === 'float') {
                    this.addInstruction(prg.OP_RETURN64);
                }
                else {
                    this.addInstruction(prg.OP_RETURN64);
                }
            }
            else {
                this.addInstruction(prg.OP_RETURN);
            }
        }
        else {
            // If outside of a function, return exits the program
            this.addInstruction(prg.OP_TERM);
        }
    }
}
exports.Compiler = Compiler;
