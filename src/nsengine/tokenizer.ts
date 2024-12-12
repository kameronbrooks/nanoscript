

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