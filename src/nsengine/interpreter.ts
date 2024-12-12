import { Token, TokenType } from "./tokenizer";
import { InterpreterStep } from "./interpreter_steps/interpreter_step";
import { ASTNode, ConditionNode } from "./ast";



// -------------------- Parser --------------------
// A simple recursive descent parser

export class Interpreter {
    private tokens: Token[];
    private current: number = 0;
    private steps: InterpreterStep[] = [];
  
    constructor(tokens: Token[]) {
      this.tokens = tokens;
      this.steps = [];
    }
    
    /**
     * Peek at the current token
     * @returns the current token
     */
    public peek(): Token {
      return this.tokens[this.current];
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
      throw new Error(`Expected token ${type} but got ${token.type}`);
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

    public previous(): Token {
        return this.tokens[this.current - 1];
    }

    public parseExpression(): ASTNode|null {
        return null;
    }


    private parseIfStatement(): ASTNode|null {
        /// TODO: Implement the parseIfStatement method
        if (this.match("IF")) {
            this.consume("LPAREN");     // Parentheses required
            const condition = this.parseStatement();
            this.consume("RPAREN");     // Parentheses required
            const body = this.parseStatement();
            
            // Body
            if (!condition || !body) {
                throw new Error("Invalid if statement");
            }
            return {
                type: "Condition",
                condition,
                body
            } as ConditionNode;
        }
        return null;
    }

    private parseWhileStatement(): ASTNode|null {
        /// TODO: Implement the parseWhileStatement method
        return null;
    }

    public parseStatement(): ASTNode|null {
        let node = this.parseIfStatement();
        if (node) return node;
        node = this.parseWhileStatement();
        if (node) return node;
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
    parse(): ASTNode|null {
      const node = this.parseExpression();
      this.consume("EOF");
      return node;
    }
  }