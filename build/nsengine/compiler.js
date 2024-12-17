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
class CompilerState {
    constructor() {
        this.currentDatatype = 'none';
    }
}
class Compiler {
    constructor(nenv) {
        this.nenv = nenv;
        this.state = new CompilerState();
        this.program = {
            nenv: this.nenv,
            instructions: [],
        };
    }
    compile(ast) {
        this.program = {
            nenv: this.nenv,
            instructions: [],
        };
        this.compileNode(ast);
        // Terminate the program
        this.program.instructions.push({
            opcode: prg.OP_TERM,
            operand: null,
        });
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
        this.compileNode(node.right);
        const rightDataType = this.state.currentDatatype;
        this.compileNode(node.left);
        const leftDataType = this.state.currentDatatype;
        // Look up the opcode based on the left and right datatypes
        const opKey = leftDataType + node.operator + rightDataType;
        const result = prg.searchOpMap(opKey);
        if (!result) {
            throw new Error(`Unknown operator: ${opKey}`);
        }
        // Add the instruction
        this.program.instructions.push({
            opcode: result.opcode,
            operand: null,
        });
    }
    compileUnaryOp(node) {
        this.compileNode(node.operand);
    }
    compileBoolean(node) {
        this.program.instructions.push({
            opcode: prg.OP_LOAD_CONST_BOOL,
            operand: node.value
        });
        this.state.currentDatatype = 'bool';
    }
    compileNumber(node) {
        // Float
        if (node.dtype === 'float') {
            this.program.instructions.push({
                opcode: prg.OP_LOAD_CONST_FLOAT,
                operand: node.value
            });
        }
        // Int
        else if (node.dtype === 'int') {
            this.program.instructions.push({
                opcode: prg.OP_LOAD_CONST_INT,
                operand: node.value
            });
        }
        // Set the current datatype
        this.state.currentDatatype = node.dtype || 'float';
    }
    compileString(node) {
        this.program.instructions.push({
            opcode: prg.OP_LOAD_CONST_STRING,
            operand: node.value
        });
        this.state.currentDatatype = 'string';
    }
    compileNull(node) {
        this.program.instructions.push({
            opcode: prg.OP_LOAD_CONST_NULL,
            operand: null,
        });
        this.state.currentDatatype = 'null';
    }
    compileIdentifier(node) {
    }
    compileAssignment(node) {
        this.compileNode(node.right);
        this.compileNode(node.left);
    }
}
exports.Compiler = Compiler;
