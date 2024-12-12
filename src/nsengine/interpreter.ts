

export interface ASTNode {
    type: string;
}

export interface NumberNode extends ASTNode {
    type: "Number";
    value: number;
}

export interface UnaryOpNode extends ASTNode {
    type: "UnaryOp";
    operator: string; // "+" or "-"
    operand: ASTNode;
}

export interface BinaryOpNode extends ASTNode {
    type: "BinaryOp";
    operator: string; // "+" or "-"
    left: ASTNode;
    right: ASTNode;
}

// -------------------- Tokenizer --------------------

export type TokenType = (
    "NUMBER" | 
    "IDENTIFIER" | 
    "STRINGLITERAL" |
    "BOOLEAN" |

    "ASSIGN" |
    "PLUS" | 
    "MINUS" |
    "MULTIPLY" |
    "DIVIDE" |
    "MODULO" |
    "POWER" |

    "NOT" |
    "AND" |
    "OR" |
    
    "INCREMENT" |
    "DECREMENT" |

    "INCREMENT_ASSIGN" |
    "DECREMENT_ASSIGN" |
    "MULTIPLY_ASSIGN" |
    "DIVIDE_ASSIGN" |
    "MODULO_ASSIGN" |

    "EQUALITY" |
    "INEQUALITY" |
    "LESS_THAN" |
    "GREATER_THAN" |
    "LESS_THAN_OR_EQUAL" |
    "GREATER_THAN_OR_EQUAL" |

    "LPAREN" | 
    "RPAREN" |
    "LBRACKET" |
    "RBRACKET" |
    "LBRACE" |
    "RBRACE" |

    "MEMBER_ACCESS" |

    "IF" |
    "ELSE" |
    "WHILE" |
    "RETURN" |
    "FOR" |
    "IN" |
    "DECLARE_VARIABLE" |
    "DECLARE_CONSTANT" |
    "FUNCTION" |
    "TRY" |
    "CATCH" |
    "EOS" |
    "EOF"
);

export const keywordTokenMap: { [key: string]: TokenType } = {
    "true": "BOOLEAN",
    "false": "BOOLEAN",
    "let": "DECLARE_VARIABLE",
    "const": "DECLARE_CONSTANT",
    "function": "FUNCTION",
    "def": "FUNCTION",
    "if": "IF",
    "else": "ELSE",
    "while": "WHILE",
    "for": "FOR",
    "return": "RETURN",
    "in": "IN",
    "try": "TRY",
    "catch": "CATCH",
}

export interface Token {
    type: TokenType;
    value?: string;
}

export class Tokenizer {
    private input: string;
    private index: number;
    private tokens: Token[];

    constructor(input: string) {
        this.input = input;
        this.index = 0;
        this.tokens = [];
    }

    tokenize(): Token[] {
        this.index = 0;
        this.tokens = [];

        while (this.index < this.input.length) {
            const i = this.index;
            
            if (this.tryParseEOS()) {
                continue;
            }
            if (this.tryParseWhiteSpace()) {
                continue;
            }
            if (this.tryParseNumber()) {
                continue;
            }
            if (this.tryParseOperator()) {
                continue;
            }
            if (this.tryParseIdentifier()) {
                continue;
            }
            
            throw new Error(`Unexpected token at index ${i}`);
        }

        this.tokens.push({ type: "EOF" });
        return this.tokens;
    }

    tryParseEOS(): boolean {
        const char = this.input[this.index];
        if (char === ";") {
            this.tokens.push({ type: "EOS" });
            this.index++;
            return true;
        }
        return false;
    }

    tryParseWhiteSpace(): boolean {
        const char = this.input[this.index];
        if (/\s/.test(char)) {
            this.index++;
            return true;
        }
        return false;
    }
    tryParseNumber(): boolean {
        const char = this.input[this.index];
        if ("0123456789".includes(char)) {
            let numStr = char;
            this.index++;
            while (this.index < this.input.length && "0123456789.".includes(this.input[this.index])) {
                numStr += this.input[this.index];
                this.index++;
            }
            this.tokens.push({ type: "NUMBER", value: numStr });
            return true;
        }
        return false;
    }


    tryParseOperator(): boolean {
        let char = this.input[this.index];
        if (char === "(") {
            this.tokens.push({ type: "LPAREN" });
            this.index++;
            return true;
        }
        if (char === ")") {
            this.tokens.push({ type: "RPAREN" });
            this.index++;
            return true;
        }
        if (char === "[") {
            this.tokens.push({ type: "LBRACKET" });
            this.index++;
            return true;
        }
        if (char === "]") {
            this.tokens.push({ type: "RBRACKET" });
            this.index++;
            return true;
        }
        if (char === "{") {
            this.tokens.push({ type: "LBRACE" });
            this.index++;
            return true;
        }
        if (char === "}") {
            this.tokens.push({ type: "RBRACE" });
            this.index++;
            return true;
        }
        if (char === ".") {
            this.tokens.push({ type: "MEMBER_ACCESS" });
            this.index++;
            return true;
        }
        if (char === "+") {
            this.index++;
            char = this.input[this.index];
            if (char === "+") {
                this.tokens.push({ type: "INCREMENT" });
                this.index++;
                return true;
            }
            else if (char === "=") {
                this.tokens.push({ type: "INCREMENT_ASSIGN" });
                this.index++;
                return true;
            }
            else {
                this.tokens.push({ type: "PLUS" });
            }
            return true;
        }
        if (char === "-") {
            this.index++;
            char = this.input[this.index];
            if (char === "-") {
                this.tokens.push({ type: "DECREMENT" });
                this.index++;
                return true;
            }
            else if (char === "=") {
                this.tokens.push({ type: "DECREMENT_ASSIGN" });
                this.index++;
                return true;
            }
            else {
                this.tokens.push({ type: "MINUS" });
            }
            return true;
        }
        // Multiply
        if (char === "*") {
            this.index++;
            char = this.input[this.index];
            // Power
            if (char === "*") {
                this.tokens.push({ type: "POWER" });
                this.index++;
                return true;
            }
            // Multiply assign
            else if (char === "=") {
                this.tokens.push({ type: "MULTIPLY_ASSIGN" });
                this.index++;
                return true;
            }
            else {
                this.tokens.push({ type: "MULTIPLY" });
            }
            return true;
        }
        // Divide
        if (char === "/") {                 
            this.index++;
            char = this.input[this.index];
            // Comment
            if (char === "/") {
                while (this.index < this.input.length && this.input[this.index] !== "\n") {
                    this.index++;
                }
                return true;
            }
            // Block comment
            if (char === "*") {
                this.index++;
                while (this.index < this.input.length-1) {
                    if (this.input[this.index] === "*" && this.input[this.index + 1] === "/") {
                        this.index += 2;
                        break;
                    }
                    this.index++;
                }
                return true;
            }
            // Divide assign
            else if (char === "=") {
                this.tokens.push({ type: "DIVIDE_ASSIGN" });
                this.index++;
                return true;
            }
            else {
                this.tokens.push({ type: "DIVIDE" });
            }
            return true;
        }

        if (char === "%") {
            this.index++;
            char = this.input[this.index];
            if (char === "=") {
                this.tokens.push({ type: "MODULO_ASSIGN" });
                this.index++;
                return true;
            }
            else {
                this.tokens.push({ type: "MODULO" });
            }
            return true;
        }

        if (char === "=") {
            this.index++;
            char = this.input[this.index];
            if (char === "=") {
                this.tokens.push({ type: "EQUALITY" });
                this.index++;
                return true;
            }
            else {
                this.tokens.push({ type: "ASSIGN" });
            }
            return true;
        }

        if (char === "<") {
            this.index++;
            char = this.input[this.index];
            if (char === "=") {
                this.tokens.push({ type: "LESS_THAN_OR_EQUAL" });
                this.index++;
                return true;
            }
            else {
                this.tokens.push({ type: "LESS_THAN" });
            }
            return true;
        }

        if (char === ">") {
            this.index++;
            char = this.input[this.index];
            if (char === "=") {
                this.tokens.push({ type: "GREATER_THAN_OR_EQUAL" });
                this.index++;
                return true;
            }
            else {
                this.tokens.push({ type: "GREATER_THAN" });
            }
            return true;
        }

        if (char === "!") {
            this.index++;
            char = this.input[this.index];
            if (char === "=") {
                this.tokens.push({ type: "INEQUALITY" });
                this.index++;
                return true;
            }
            else {
                this.tokens.push({ type: "NOT" });
            }
        }
        return false;
    }

    tryParseIdentifier(): boolean {
        const char = this.input[this.index];
        const allowedFirstChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_';
        const allowedChars = allowedFirstChars + '0123456789';

        if (allowedFirstChars.includes(char)) {
            let identifier = char;
            this.index++;
            while (this.index < this.input.length && allowedChars.includes(this.input[this.index])) {
                identifier += this.input[this.index];
                this.index++;
            }

            if (keywordTokenMap[identifier]) {
                this.tokens.push({ type: keywordTokenMap[identifier] });
                return true;
            }
            else {
                this.tokens.push({ type: "IDENTIFIER", value: identifier });
            }
            
            return true;
        }
        return false;
    }
}



// -------------------- Parser --------------------

// A simple recursive descent parser

class Parser {
    private tokens: Token[];
    private current: number = 0;
  
    constructor(tokens: Token[]) {
      this.tokens = tokens;
    }
  
    private peek(): Token {
      return this.tokens[this.current];
    }
  
    private consume(type: TokenType): Token {
      const token = this.peek();
      if (token.type === type) {
        this.current++;
        return token;
      }
      throw new Error(`Expected token ${type} but got ${token.type}`);
    }
  
    private match(...types: TokenType[]): boolean {
      const token = this.peek();
      if (types.includes(token.type)) {
        this.current++;
        return true;
      }
      return false;
    }
  
    // Expression -> Term (("+" | "-") Term)*
    parseExpression(): ASTNode {
      let node = this.parseTerm();
  
      while (this.peek().type === "PLUS" || this.peek().type === "MINUS") {
        const operatorToken = this.peek();
        if (this.match("PLUS")) {
          const right = this.parseTerm();
          node = {
            type: "BinaryOp",
            operator: "+",
            left: node,
            right: right
          } as BinaryOpNode;
        } else if (this.match("MINUS")) {
          const right = this.parseTerm();
          node = {
            type: "BinaryOp",
            operator: "-",
            left: node,
            right: right
          } as BinaryOpNode;
        }
      }
  
      return node;
    }
  
    // Term -> Number | "(" Expression ")"
    parseTerm(): ASTNode {
      const token = this.peek();
  
      if (token.type === "NUMBER") {
        this.consume("NUMBER");
        return {
          type: "Number",
          value: parseInt(token.value!, 10)
        } as NumberNode;
      }
  
      if (token.type === "LPAREN") {
        this.consume("LPAREN");
        const node = this.parseExpression();
        this.consume("RPAREN");
        return node;
      }
  
      throw new Error(`Unexpected token: ${token.type}`);
    }
  
    parse(): ASTNode {
      const node = this.parseExpression();
      this.consume("EOF");
      return node;
    }
  }