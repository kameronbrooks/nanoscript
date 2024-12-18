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
class ScopeObject {
    constructor(name, datatype, value, type) {
        this.name = name;
        this.datatype = datatype;
        this.value = value;
        this.type = type;
    }
}
class Scope {
    constructor(parent = null, nenv) {
        this.nenv = nenv;
        this.parent = parent;
        this.objects = new Map();
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
    addInstruction(opcode, operand = null) {
        this.program.instructions.push({
            opcode,
            operand
        });
    }
    compile(ast) {
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
            default:
                throw new Error(`Unknown node type: ${node.type}`);
        }
    }
    compileBinaryOp(node) {
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
    compileUnaryOp(node) {
        this.compileNode(node.operand);
        const datatype = this.state.currentDatatype;
        const opKey = node.postfix ? datatype + node.operator : node.operator + datatype;
        const result = prg.searchOpMap(opKey);
        if (!result) {
            throw new Error(`Unknown operator: ${opKey}`);
        }
        // Add the instruction
        this.addInstruction(result.opcode);
        this.state.currentDatatype = result.returnDtype;
    }
    compileBoolean(node) {
        this.addInstruction(prg.OP_LOAD_CONST_BOOL, node.value);
        this.state.currentDatatype = 'bool';
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
    }
    compileString(node) {
        this.addInstruction(prg.OP_LOAD_CONST_STRING, node.value);
        this.state.currentDatatype = 'string';
    }
    compileNull(node) {
        this.addInstruction(prg.OP_LOAD_CONST_NULL, null);
        this.state.currentDatatype = 'null';
    }
    compileIdentifier(node) {
        var _a;
        let target = (_a = this.state.currentScope) === null || _a === void 0 ? void 0 : _a.getObject(node.value);
        if (!target) {
            throw new Error(`Unknown identifier: ${node.value}`);
        }
        // Load the value
        // TODO: Figure out the opcode based on the object type
        // Also figure out if this should be a load or a store
    }
    compileAssignment(node) {
        this.compileNode(node.right);
        this.compileNode(node.left);
    }
}
exports.Compiler = Compiler;
