

// -------------------- Tokenizer --------------------

export type TokenType = (
    "NUMBER" | 
    "IDENTIFIER" | 
    "STRINGLITERAL" |
    "BOOLEAN" |
    "NULL" |

    "ASSIGN" |
    "PLUS" | 
    "MINUS" |
    "MULTIPLY" |
    "DIVIDE" |
    "MODULO" |
    "POWER" |
    "SQRT" |

    "NOT" |
    "AND" |
    "OR" |

    "BITWISE_AND" |
    "BITWISE_OR" |
    
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

    "COMMA" |

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
    "null": "NULL",
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
            this.tokens.push({ type: "LPAREN", value: char });
            this.index++;
            return true;
        }
        if (char === ")") {
            this.tokens.push({ type: "RPAREN", value: char });
            this.index++;
            return true;
        }
        if (char === "[") {
            this.tokens.push({ type: "LBRACKET", value: char });
            this.index++;
            return true;
        }
        if (char === "]") {
            this.tokens.push({ type: "RBRACKET", value: char });
            this.index++;
            return true;
        }
        if (char === "{") {
            this.tokens.push({ type: "LBRACE", value: char });
            this.index++;
            return true;
        }
        if (char === "}") {
            this.tokens.push({ type: "RBRACE", value: char });
            this.index++;
            return true;
        }
        if (char === ".") {
            this.tokens.push({ type: "MEMBER_ACCESS", value: char });
            this.index++;
            return true;
        }
        if (char === "+") {
            this.index++;
            char = this.input[this.index];
            if (char === "+") {
                this.tokens.push({ type: "INCREMENT", value: "++" });
                this.index++;
                return true;
            }
            else if (char === "=") {
                this.tokens.push({ type: "INCREMENT_ASSIGN", value: "+=" });
                this.index++;
                return true;
            }
            else {
                this.tokens.push({ type: "PLUS", value: '+'});
            }
            return true;
        }
        if (char === "-") {
            this.index++;
            char = this.input[this.index];
            if (char === "-") {
                this.tokens.push({ type: "DECREMENT", value: "--" });
                this.index++;
                return true;
            }
            else if (char === "=") {
                this.tokens.push({ type: "DECREMENT_ASSIGN", value: "-=" });
                this.index++;
                return true;
            }
            else {
                this.tokens.push({ type: "MINUS", value: '-' });
            }
            return true;
        }
        // Multiply
        if (char === "*") {
            this.index++;
            char = this.input[this.index];
            // Power
            if (char === "*") {
                this.tokens.push({ type: "POWER", value: "**" });
                this.index++;
                return true;
            }
            // Multiply assign
            else if (char === "=") {
                this.tokens.push({ type: "MULTIPLY_ASSIGN", value: "*=" });
                this.index++;
                return true;
            }
            else {
                this.tokens.push({ type: "MULTIPLY", value: '*' });
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
            // sqrt
            else if (char === "/") {
                this.tokens.push({ type: "SQRT", value: "*/" });
                this.index++;
                return true;
            }
            // Divide assign
            else if (char === "=") {
                this.tokens.push({ type: "DIVIDE_ASSIGN", value: "/=" });
                this.index++;
                return true;
            }
            else {
                this.tokens.push({ type: "DIVIDE", value: '/' });
            }
            return true;
        }
        // Modulo
        if (char === "%") {
            this.index++;
            char = this.input[this.index];
            if (char === "=") {
                this.tokens.push({ type: "MODULO_ASSIGN", value: "%=" });
                this.index++;
                return true;
            }
            else {
                this.tokens.push({ type: "MODULO", value: "%" });
            }
            return true;
        }

        if (char === "=") {
            this.index++;
            char = this.input[this.index];
            if (char === "=") {
                this.tokens.push({ type: "EQUALITY", value: "==" });
                this.index++;
                return true;
            }
            else {
                this.tokens.push({ type: "ASSIGN", value: "=" });
            }
            return true;
        }

        if (char === "<") {
            this.index++;
            char = this.input[this.index];
            if (char === "=") {
                this.tokens.push({ type: "LESS_THAN_OR_EQUAL", value: "<=" });
                this.index++;
                return true;
            }
            else {
                this.tokens.push({ type: "LESS_THAN", value: "<" });
            }
            return true;
        }

        if (char === ">") {
            this.index++;
            char = this.input[this.index];
            if (char === "=") {
                this.tokens.push({ type: "GREATER_THAN_OR_EQUAL", value: ">=" });
                this.index++;
                return true;
            }
            else {
                this.tokens.push({ type: "GREATER_THAN", value: ">" });
            }
            return true;
        }

        if (char === "!") {
            this.index++;
            char = this.input[this.index];
            if (char === "=") {
                this.tokens.push({ type: "INEQUALITY", value: "!=" });
                this.index++;
                return true;
            }
            else {
                this.tokens.push({ type: "NOT", value: "!" });
            }
        }

        if (char === "&") {
            this.index++;
            char = this.input[this.index];
            if (char === "&") {
                this.tokens.push({ type: "AND", value: "&&" });
                this.index++;
                return true;
            }
            else {
                this.tokens.push({ type: "BITWISE_AND", value: "&" });
            }
            return true;
        }

        if (char === "|") {
            this.index++;
            char = this.input[this.index];
            if (char === "|") {
                this.tokens.push({ type: "OR", value: "||" });
                this.index++;
                return true;
            }
            else {
                this.tokens.push({ type: "BITWISE_OR", value: "|" });
            }
            return true;
        }

        if (char === ",") {
            this.tokens.push({ type: "COMMA", value: "," });
            this.index++;
            return true;
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