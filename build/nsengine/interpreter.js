"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Interpreter = void 0;
// -------------------- Parser --------------------
// A simple recursive descent parser
class Interpreter {
    constructor(tokens) {
        this.current = 0;
        this.tokens = tokens;
    }
    /**
     * Peek at the current token
     * @returns the current token
     */
    peek() {
        return this.tokens[this.current];
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
    parseExpression() {
        return null;
    }
    parseIfStatement() {
        /// TODO: Implement the parseIfStatement method
        if (this.match("IF")) {
            this.consume("LPAREN"); // Parentheses required
            const condition = this.parseStatement();
            this.consume("RPAREN"); // Parentheses required
            const body = this.parseStatement();
            // Body
            if (!condition || !body) {
                throw new Error("Invalid if statement");
            }
            return {
                type: "Condition",
                condition,
                body
            };
        }
        return null;
    }
    parseWhileStatement() {
        /// TODO: Implement the parseWhileStatement method
        return null;
    }
    parseStatement() {
        let node = this.parseIfStatement();
        if (node)
            return node;
        node = this.parseWhileStatement();
        if (node)
            return node;
        //node = this.parseForStatement();
        //if (node) return node;
        //node = this.parseForStatement();
        //if (node) return node;
        //node = this.parseForEachStatement();
        //if (node) return node;
        //node = this.parseBlock();
        //if (node) return node;
        //node = this.parsePrintStatement();
        //if (node) return node;
        if (this.peek().type !== "EOS") {
            return this.parseExpression();
        }
        throw new Error("Unknown statement");
    }
    /**
     * Parse the given tokens
     * @returns the AST
     */
    parse() {
        const node = this.parseExpression();
        this.consume("EOF");
        return node;
    }
}
exports.Interpreter = Interpreter;
