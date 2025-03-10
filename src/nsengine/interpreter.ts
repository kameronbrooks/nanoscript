/**
 * @file interpreter.ts
 * @description The interpreter is responsible for parsing the tokens and creating the AST
 */

import { Token, TokenType } from "./tokenizer";
import { InterpreterStep, InterpreterStepParams } from "./interpreter_steps/interpreter_step";
import { ASTNode, ConditionNode, BlockNode, DeclarationNode, LoopNode, ProgramNode, BreakNode, ContinueNode } from "./ast";
import * as ist from "./interpreter_steps/interpreter_step_types";


export type ExpressionInterpreterSteps = {
    stringLiteral: InterpreterStep;
    primative: InterpreterStep;
    arrayLiteral: ist.InterpretArrayLiteral;
    objectLiteral: ist.InterpretObjectLiteral;
    identifier: InterpreterStep;
    memberAccess: ist.InterpretMemberAccess;
    indexer: ist.InterpretIndexer;
    functionCall: ist.InterpretFunctionCall;
    preUnary: InterpreterStep;
    postUnary: InterpreterStep;
    powRoot: InterpreterStep;
    mulDiv: InterpreterStep;
    addSub: InterpreterStep;
    comparison: InterpreterStep;
    equality: InterpreterStep;
    andOr: InterpreterStep;
    functionDefinition: ist.InterpretFunctionDefinition;
    binarySpread: ist.InterpretBinarySpread;
    assignment: InterpreterStep;
    ternary: ist.InterpretTernary;
    expression: InterpreterStep;
}

// -------------------- Parser --------------------
// A simple recursive descent parser

export class Interpreter {
    private tokens: Token[];
    private current: number = 0;
    public readonly expressionSteps: ExpressionInterpreterSteps;

  
    constructor(tokens: Token[], params?: {verboseMode?: boolean}) {
        this.tokens = tokens;

        // Initialize the expression steps
        const stringLiteral = new ist.InterpretStringLiteral(this, null);
        const primative = new ist.InterpretPrimative(this, stringLiteral);
        const arrayLiteral = new ist.InterpretArrayLiteral(this, primative);
        const objectLiteral = new ist.InterpretObjectLiteral(this, arrayLiteral);
        const identifier = new ist.InterpretIdentifier(this, objectLiteral);
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
        const functionDefinition = new ist.InterpretFunctionDefinition(this, andOr);
        const binarySpread = new ist.InterpretBinarySpread(this, functionDefinition);
        const assignment = new ist.InterpretAssignment(this, binarySpread);
        const ternary = new ist.InterpretTernary(this, assignment);

        this.expressionSteps = {
            stringLiteral: stringLiteral,
            primative: primative,
            arrayLiteral: arrayLiteral,
            objectLiteral: objectLiteral,
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
            functionDefinition: functionDefinition,
            binarySpread: binarySpread,
            assignment: assignment,
            ternary: ternary,
        } as ExpressionInterpreterSteps;

        for (let step in this.expressionSteps) {
            this.expressionSteps[step as keyof ExpressionInterpreterSteps].verboseMode = params?.verboseMode || false;
        }
    }
    
    public createSubInterpreter(tokens: Token[]): Interpreter {
        return new Interpreter(tokens);
    }

    /**
     * Peek at the current token
     * @returns the current token
     */
    public peek(): Token {
        return this.tokens[this.current];
    }

    public isEOF(): boolean {
        return this.peek().type === "EOF" || this.current >= this.tokens.length;
    }
    
    /**
     * Consume the current token if it matches the given type
     * Otherwise, throw an error
     * @param type 
     * @returns 
     */
    public consume(type: TokenType): Token {
      const token = this.peek();
      if (token.type === type) {
        this.current++;
        return token;
      }
      this.error(`Expected token ${type} but got ${token.type}`);
    }

    /**
     * Skips the current token if it matches any of the given types
     * Does not throw an error if the token does not match
     * @param types 
     */
    public skip(types: TokenType[]): void {
        if (types.includes(this.peek().type)) {
            this.current++;
        }
    }
    
    /**
     * Determine if the current token matches any of the given types
     * @param types 
     * @returns 
     */
    public match(...types: TokenType[]): boolean {
      const token = this.peek();
      if (types.includes(token.type)) {
        this.current++;
        return true;
      }
      return false;
    }

    /**
     * Look ahead in the token stream to see if the pattern matches
     * @param pattern 
     * @returns 
     */
    public patternLookahead(pattern: any): boolean {
        let currentIndex = this.current;
        let patternIndex = 0;
        let match = true;

        while ((patternIndex < pattern.length) && (currentIndex < this.tokens.length)) {
            const token = this.tokens[currentIndex];

            // if the element is an array, then the token type must be in the array
            if(Array.isArray(pattern[patternIndex])) {
                if (pattern[patternIndex].includes('*')) {
                    // wildcard match
                }
                // Check to see if this is a conditional collection
                else if (pattern[patternIndex].includes('?')) {
                    if (!pattern[patternIndex].includes(token.type)) {
                        patternIndex++;
                        continue;
                    }
                }
                // else if not a match
                else if (!pattern[patternIndex].includes(token.type)) {
                    match = false;
                    break;
                }
            }
            else {
                // wildcard match
                if (pattern[patternIndex] == "*") {

                }
                // conditional match
                else if (pattern[patternIndex].startsWith("?")) {
                    if (token.type !== pattern[patternIndex].substring(1)) {
                        patternIndex++;
                        continue;
                    }
                }
                // exact match
                else if (token.type !== pattern[patternIndex]) {
                    match = false;
                    break;
                }
            }
            currentIndex++;
            patternIndex++;
        }
        
        return match;
    }

    /**
     * Get the previous token
     * @returns
     * 
     */
    public previous(): Token {
        return this.tokens[this.current - 1];
    }

    /**
     * Parse an expression
     * Currently, this starts with the ternary operator
     * @param params 
     * @returns 
     */
    public parseExpression(params?: InterpreterStepParams): ASTNode | undefined | null {
        const node = this.expressionSteps.ternary.execute(params);
        this.associateCurrentLine(node);
        return node;
    }

    /**
     * Parse an if statement
     * @returns 
     */
    private parseIfStatement(): ASTNode|null|undefined {
        /// TODO: Implement the parseIfStatement method
        if (this.match("IF")) {
            this.consume("LPAREN");     // Parentheses required
            const condition = this.parseExpression({
                returnFunctionCalls: true
            });
            this.consume("RPAREN");     // Parentheses required

            const body = this.parseStatement();
            
            // Body
            if (!condition || !body) {
                this.error("Invalid if statement");
            }

            if (this.match("ELSE")) {
                const elseBody = this.parseStatement();
                if (!elseBody) {
                    this.error("Invalid else statement");
                }
                return {
                    type: "Condition",
                    condition,
                    body,
                    elseBody
                } as ConditionNode;
            }

            return {
                type: "Condition",
                condition,
                body,
                line: this.previous().line
            } as ConditionNode;
        }
        return null;
    }

    /**
     * Parse a block of statements {...}
     * @returns 
     */
    private parseBlock(): ASTNode|null|undefined {
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
                statements,
                line: this.previous().line
            } as BlockNode;
        }
        return null;
    }

    /**
     * Parse a while statement
     * @returns 
     */
    private parseWhileStatement(): ASTNode|null|undefined {
        if (this.match("WHILE")) {
            this.consume("LPAREN");     // Parentheses required
            const condition = this.parseExpression({
                returnFunctionCalls: true
            });
            this.consume("RPAREN");     // Parentheses required
            const body = this.parseStatement();
            
            // Body
            if (!condition || !body) {
                this.error("Invalid while statement");
            }

            return {
                type: "Loop",
                condition,
                body,
                line: this.previous().line,
                loopType: "while"
            } as LoopNode;
        }
        return null;
    }

    /**
     * Parse a break statement
     * @returns 
     */
    private parseBreakStatement(): ASTNode|null|undefined {
        if (this.match("BREAK")) {
            if(this.match("EOS")) {
                return {
                    type: "Break",
                    level: 1,
                    line: this.previous().line
                } as BreakNode;
            }
            else {
                const level = this.consume("NUMBER").value;
                this.consume("EOS");
                return {
                    type: "Break",
                    level: parseInt(level as string),
                    line: this.previous().line
                } as BreakNode;
            }
        }
        return null;
    }

    /**
     * Parse a continue statement
     * @returns
     */
    private parseContinueStatement(): ASTNode|null|undefined {
        if (this.match("CONTINUE")) {
            if(this.match("EOS")) {
                return {
                    type: "Continue",
                    level: 1,
                    line: this.previous().line
                } as ContinueNode;
            }
            else {
                throw new Error("; expected after continue statement");
            }
        }
        return null;
    }

    /**
     * Parse a return statement
     * @returns 
     */
    private parseReturnStatement(): ASTNode|null|undefined {
        if (this.match("RETURN")) {

            if (this.match("EOS")) {
                return {
                    type: "Return",
                    value: null,
                    line: this.previous().line
                } as ASTNode;
            }

            const value = this.parseExpression({returnFunctionCalls: true});
            this.consume("EOS");
            return {
                type: "Return",
                value,
                line: this.previous().line
            } as ASTNode;
        }
        return null;
    }

    /**
     * Parse a for statement
     * Either a tranditional c-style for loop or a foreach-style loop
     * @returns
     */
    private parseForStatement(): ASTNode|null|undefined {
        // If this is a for in loop for an object or dict
        if (this.patternLookahead(["FOR", "LPAREN", "IDENTIFIER", "COMMA", "IDENTIFIER", "IN"])) {
            /*
            this.consume("FOR");
            this.consume("LPAREN");
            const keyASTNode = {
                type: "Declaration",
                identifier: this.consume("IDENTIFIER").value as string,
                initializer: undefined,
                dtype: 'any',
                constant: false,
                line: this.previous().line
            } as DeclarationNode;

            this.consume("COMMA");
            const valueASTNode = {
                type: "Declaration",
                identifier: this.consume("IDENTIFIER").value as string,
                initializer: undefined,
                dtype: 'any',
                constant: false,
                line: this.previous().line
            } as DeclarationNode;

            
            this.consume("IN");
            const iterable = this.parseExpression({
                returnFunctionCalls: true
            });
            this.consume("RPAREN");     // Parentheses required
            const body = this.parseStatement();

            return {
                type: "Loop",
                initializer: {
                    type: "Block",
                    statements: [keyASTNode, valueASTNode],
                    line: this.previous().line
                } as BlockNode,
                iterable,
                body,
                line: this.previous().line
            } as LoopNode;
             */
        }
        // If this is a for in loop for a set or list
        else if (this.patternLookahead(["FOR", "LPAREN", ["?", "DECLARE_VARIABLE", "DECLARE_CONSTANT"], "IDENTIFIER", "IN"])) {
            this.consume("FOR");
            this.consume("LPAREN");
            // skip the let or const keyword
            this.skip(["DECLARE_VARIABLE", "DECLARE_CONSTANT"]);
            const declarationNode = {
                type: "Declaration",
                identifier: this.consume("IDENTIFIER").value as string,
                initializer: undefined,
                dtype: 'any',
                constant: true,
                line: this.previous().line
            } as DeclarationNode;

            this.consume("IN");

            // Parse the iterable expression
            const iterable = this.parseExpression({
                returnFunctionCalls: true
            });

            this.consume("RPAREN");     // Parentheses required

            // Body of the loop
            const body = this.parseStatement();

            return {
                type: "Loop",
                initializer: declarationNode,
                iterable: iterable,
                body: body,
                line: this.previous().line,
                loopType: "foreach"
            } as LoopNode;
        }
        // Otherwise it is a traditional c-style for loop
        else {
            if (this.match("FOR")) {
                this.consume("LPAREN");     // Parentheses required
                const initializer = this.parseStatement();
                const condition = this.parseExpression({
                    returnFunctionCalls: true
                });
                this.consume("EOS");
                const increment = this.parseExpression();
                this.consume("RPAREN");     // Parentheses required
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
                    body,
                    line: this.previous().line,
                    loopType: "for"
                } as LoopNode;
            }
        }
        
    }

    /**
     * Parse a variable declaration
     * @returns 
     */
    private parseDeclaration(): ASTNode|null|undefined {
        if (this.match("DECLARE_VARIABLE")) {
            const name = this.consume("IDENTIFIER").value;
            
            let value = undefined;
            let datatype = 'any';
            if (this.match("ASSIGN")) {
                value = this.parseExpression({
                    returnFunctionCalls: true
                });
                datatype = (value as any)?.dtype || 'any';
            }
            this.consume("EOS");
            
            return {
                type: "Declaration",
                identifier: name as string,
                initializer: value,
                dtype: datatype,
                constant: false,
                line: this.previous().line
            } as DeclarationNode;
        }
        else if (this.match("DECLARE_CONSTANT")) {
            const name = this.consume("IDENTIFIER").value;
            
            let value = undefined;
            let datatype = 'any';
            if (this.match("ASSIGN")) {
                value = this.parseExpression({
                    returnFunctionCalls: true
                });
                datatype = (value as any)?.dtype || 'any';
            }
            this.consume("EOS");

            return {
                type: "Declaration",
                identifier: name as string,
                initializer: value,
                dtype: datatype,
                constant: true,
                line: this.previous().line
            } as DeclarationNode;
        }
        return null;
    }

    /**
     * Parse a function declaration
     * @returns 
     */
    public parseFunctionDeclaration(): ASTNode|null|undefined {
        return this.expressionSteps.functionDefinition.execute({
            executeInStatementMode: true
        });
    }

    /**
     * Report an error
     * @param message 
     * @returns 
     */
    public error(message: string): never {
        const line = this.peek().line;
        throw new Error(`Interpreter Error on line (${line}): ` + message);
    }

    /**
     * Associate the current line number with the given node
     * @param node 
     */
    public associateCurrentLine(node: ASTNode | null | undefined): void {
        if(node && node.line === undefined) {
            node.line = this.previous().line
        }
    }

    /**
     * Parse a statement
     * Essentially a large switch statement that can parse all the different types of statements
     * This is the main looping function of the interpreter
     * @returns 
     */
    public parseStatement(): ASTNode|null|undefined {
        let node = this.parseBlock();
        if (node) return node;
        node = this.parseIfStatement();
        if (node) return node;
        node = this.parseWhileStatement();
        if (node) return node;
        node = this.parseDeclaration();
        if (node) return node;
        node = this.parseForStatement();
        if (node) return node;
        node = this.parseWhileStatement();
        if (node) return node;
        node = this.parseBreakStatement();
        if (node) return node;
        node = this.parseContinueStatement();
        if (node) return node;
        node = this.parseFunctionDeclaration();
        if (node) return node;
        node = this.parseReturnStatement();
        if (node) return node;
        
        //node = this.parsePrintStatement();
        //if (node) return node;
        if(this.peek().type == "EOS" || this.peek().type == "EOF") {

            this.consume(this.peek().type);
            return null;
        }
        else {
            node = this.parseExpression();

            // Associate the current line number with the node for error reporting
            this.associateCurrentLine(node);

            this.consume("EOS");
            return node;
        }


        throw new Error("Unknown statement: " + this.peek().type);
    }
    
    /**
     * Parse the given tokens
     * @returns the AST
     */
    parse(): ASTNode|null|undefined {
        const node = {
            type: "Program",
            statements: []
        } as ProgramNode
        while (!this.isEOF()) {
            const statement = this.parseStatement();

            // Associate the current line number with the node for error reporting
            // Will catch nodes that are not already associated with a line number
            this.associateCurrentLine(statement);

            if (statement) {
                node.statements.push(statement);
            }
        }
        this.consume("EOF");
        return node;
    }
  }