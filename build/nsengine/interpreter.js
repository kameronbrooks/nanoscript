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
exports.Interpreter = void 0;
const ist = __importStar(require("./interpreter_steps/interpreter_step_types"));
class Interpreter {
    constructor(tokens) {
        this.current = 0;
        this.tokens = tokens;
        // Initialize the expression steps
        const stringLiteral = new ist.InterpretStringLiteral(this, null);
        const primative = new ist.InterpretPrimative(this, stringLiteral);
        const identifier = new ist.InterpretIdentifier(this, primative);
        const memberAccess = new ist.InterpretMemberAccess(this, identifier);
        const indexer = new ist.InterpretIndexer(this, memberAccess);
        const functionCall = new ist.InterpretFunctionCall(this, indexer);
        const preUnary = new ist.InterpretPreUnary(this, functionCall);
        const postUnary = new ist.InterpretPostUnary(this, preUnary);
        const powRoot = new ist.InterpretPowRoot(this, postUnary);
        const mulDiv = new ist.InterpretMulDiv(this, powRoot);
        const addSub = new ist.InterpretAddSub(this, mulDiv);
        const comparison = new ist.InterpretComparison(this, addSub);
        const equality = new ist.InterpretEquality(this, comparison);
        const andOr = new ist.InterpretAndOr(this, equality);
        const assignment = new ist.InterpretAssignment(this, andOr);
        this.expressionSteps = {
            stringLiteral: stringLiteral,
            primative: primative,
            identifier: identifier,
            memberAccess: memberAccess,
            indexer: indexer,
            functionCall: functionCall,
            preUnary: preUnary,
            postUnary: postUnary,
            powRoot: powRoot,
            mulDiv: mulDiv,
            addSub: addSub,
            comparison: comparison,
            equality: equality,
            andOr: andOr,
            assignment: assignment
        };
    }
    createSubInterpreter(tokens) {
        return new Interpreter(tokens);
    }
    /**
     * Peek at the current token
     * @returns the current token
     */
    peek() {
        return this.tokens[this.current];
    }
    isEOF() {
        return this.peek().type === "EOF" || this.current >= this.tokens.length;
    }
    /**
     * Consume the current token if it matches the given type
     * Otherwise, throw an error
     * @param type
     * @returns
     */
    consume(type) {
        const token = this.peek();
        if (token.type === type) {
            this.current++;
            return token;
        }
        throw new Error(`Expected token ${type} but got ${token.type}`);
    }
    /**
     * Determine if the current token matches any of the given types
     * @param types
     * @returns
     */
    match(...types) {
        const token = this.peek();
        if (types.includes(token.type)) {
            this.current++;
            return true;
        }
        return false;
    }
    previous() {
        return this.tokens[this.current - 1];
    }
    parseExpression() {
        return this.expressionSteps.assignment.execute();
    }
    parseIfStatement() {
        /// TODO: Implement the parseIfStatement method
        if (this.match("IF")) {
            this.consume("LPAREN"); // Parentheses required
            const condition = this.parseExpression();
            this.consume("RPAREN"); // Parentheses required
            const body = this.parseStatement();
            // Body
            if (!condition || !body) {
                throw new Error("Invalid if statement");
            }
            if (this.match("ELSE")) {
                const elseBody = this.parseStatement();
                if (!elseBody) {
                    throw new Error("Invalid else statement");
                }
                return {
                    type: "Condition",
                    condition,
                    body,
                    elseBody
                };
            }
            return {
                type: "Condition",
                condition,
                body
            };
        }
        return null;
    }
    parseBlock() {
        if (this.match("LBRACE")) {
            const statements = [];
            while (!this.match("RBRACE")) {
                const statement = this.parseStatement();
                if (statement) {
                    statements.push(statement);
                }
            }
            return {
                type: "Block",
                statements
            };
        }
        return null;
    }
    parseWhileStatement() {
        if (this.match("WHILE")) {
            this.consume("LPAREN"); // Parentheses required
            const condition = this.parseExpression();
            this.consume("RPAREN"); // Parentheses required
            const body = this.parseStatement();
            // Body
            if (!condition || !body) {
                throw new Error("Invalid while statement");
            }
            return {
                type: "Loop",
                condition,
                body
            };
        }
        return null;
    }
    parseBreakStatement() {
        if (this.match("BREAK")) {
            if (this.match("EOS")) {
                return {
                    type: "Break",
                    level: 1
                };
            }
            else {
                const level = this.consume("NUMBER").value;
                this.consume("EOS");
                return {
                    type: "Break",
                    level: parseInt(level)
                };
            }
        }
    }
    parseForStatement() {
        if (this.match("FOR")) {
            this.consume("LPAREN"); // Parentheses required
            const initializer = this.parseStatement();
            const condition = this.parseExpression();
            this.consume("EOS");
            const increment = this.parseExpression();
            this.consume("RPAREN"); // Parentheses required
            const body = this.parseStatement();
            // Body
            if (!initializer || !condition || !increment || !body) {
                throw new Error("Invalid for statement");
            }
            return {
                type: "Loop",
                initializer,
                condition,
                increment,
                body
            };
        }
    }
    parseDeclaration() {
        if (this.match("DECLARE_VARIABLE")) {
            const name = this.consume("IDENTIFIER").value;
            let value = undefined;
            if (this.match("ASSIGN")) {
                value = this.parseExpression();
            }
            this.consume("EOS");
            return {
                type: "Declaration",
                identifier: name,
                initializer: value,
                dtype: 'any',
                constant: false
            };
        }
        else if (this.match("DECLARE_CONSTANT")) {
            const name = this.consume("IDENTIFIER").value;
            let value = undefined;
            if (this.match("ASSIGN")) {
                value = this.parseExpression();
            }
            this.consume("EOS");
            return {
                type: "Declaration",
                identifier: name,
                initializer: value,
                dtype: 'any',
                constant: true
            };
        }
        return null;
    }
    parseStatement() {
        let node = this.parseIfStatement();
        if (node)
            return node;
        node = this.parseWhileStatement();
        if (node)
            return node;
        node = this.parseDeclaration();
        if (node)
            return node;
        node = this.parseForStatement();
        if (node)
            return node;
        node = this.parseWhileStatement();
        if (node)
            return node;
        node = this.parseBreakStatement();
        if (node)
            return node;
        //node = this.parseForStatement();
        //if (node) return node;
        //node = this.parseForEachStatement();
        //if (node) return node;
        node = this.parseBlock();
        if (node)
            return node;
        //node = this.parsePrintStatement();
        //if (node) return node;
        if (this.peek().type !== "EOS") {
            node = this.parseExpression();
            // Dont worry about this yet
            this.consume("EOS");
            return node;
        }
        throw new Error("Unknown statement");
    }
    /**
     * Parse the given tokens
     * @returns the AST
     */
    parse() {
        const node = {
            type: "Program",
            statements: []
        };
        while (!this.isEOF()) {
            const statement = this.parseStatement();
            if (statement) {
                node.statements.push(statement);
            }
        }
        this.consume("EOF");
        return node;
    }
}
exports.Interpreter = Interpreter;
