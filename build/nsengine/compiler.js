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
        this.stackVariables = [];
        this.nenv = nenv;
        this.parent = parent;
        this.objects = new Map();
        this.stackVariables = stackVariables || [];
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
    addLocalVariable(name, isConst, datatype, value) {
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
        };
        this.objects.set(name, obj);
        this.stackVariables.push(name);
        return obj;
    }
    isGlobal() {
        return this.parent === null;
    }
}
class CompilerState {
    constructor(currentScope) {
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
class Compiler {
    constructor(nenv) {
        this.engineVersion = "0.0.1";
        this.frameBeginIndex = [];
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
    addInstruction(opcode, operand = null) {
        this.program.instructions.push({
            opcode,
            operand
        });
        return this.program.instructions.at(-1);
    }
    insertInstruction(index, opcode, operand = null) {
        this.program.instructions.splice(index, 0, {
            opcode,
            operand
        });
        return this.program.instructions.at(index);
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
        if (result.opcode == prg.OP_INCREMENT_LOCAL_POST || result.opcode == prg.OP_DECREMENT_LOCAL_POST) {
            const lastInstruction = this.program.instructions.at(-1);
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
        this.addInstruction(prg.OP_LOAD_CONST_BOOL, node.value);
        this.state.currentDatatype = 'bool';
        this.state.isLValue = false;
    }
    compileNumber(node) {
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
    compileString(node) {
        this.addInstruction(prg.OP_LOAD_CONST_STRING, node.value);
        this.state.currentDatatype = 'string';
        this.state.isLValue = false;
    }
    compileNull(node) {
        this.addInstruction(prg.OP_LOAD_CONST_NULL, null);
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
        console.log(node.object);
        console.log(node.member);
        // Compile the object
        this.compileNode(node.object);
        // Compile the member
        this.addInstruction(prg.OP_LOAD_MEMBER, node.member.value);
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
        }
        else {
            // Add the instruction
            this.addInstruction(prg.OP_LOAD_MEMBER, node.value);
            this.state.isLValue = true;
        }
        // Load the value
        // TODO: Figure out the opcode based on the object type
        // Also figure out if this should be a load or a store
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
        let falseBranchIndex = this.getTailIndex();
        let elseJumpInstruction = null;
        if (node.elseBody) {
            elseJumpInstruction = this.addInstruction(prg.OP_JUMP, null);
            falseBranchIndex = this.getTailIndex();
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
            this.addInstruction(prg.OP_STORE_LOCAL, obj === null || obj === void 0 ? void 0 : obj.localStackIndex);
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
        // Add the instruction
        this.addInstruction(prg.OP_CALL_EXTERNAL, node.arguments.length);
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
        const conditionIndex = this.getTailIndex();
        this.compileNode(node.condition);
        const branchInstruction = this.addInstruction(prg.OP_BRANCH_FALSE, null);
        const jumpIndex = this.getTailIndex();
        this.compileNode(node.body);
        // Compile the increment if there is one (for loop)
        if (node.increment) {
            this.compileNode(node.increment);
        }
        // Jump back to the condition
        this.addInstruction(prg.OP_JUMP, conditionIndex);
        const endOfLoopIndex = this.getTailIndex();
        if (!branchInstruction) {
            throw new Error("Branch instruction not found");
        }
        branchInstruction.operand = endOfLoopIndex;
    }
}
exports.Compiler = Compiler;
