

// -------------------- Tokenizer --------------------

export type TokenType = (
    "NUMBER" | 
    "IDENTIFIER" | 
    "STRINGLITERAL" |
    "STRINGBUILDER" |
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

    "CARET" |

    "LEFT_SHIFT" |
    "RIGHT_SHIFT" |
    
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
    "COLON" |
    "ELLIPSIS" |

    "MEMBER_ACCESS" |

    "IF" |
    "ELSE" |
    "WHILE" |
    "RETURN" |
    "BREAK" |
    "CONTINUE" |
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
    "break": "BREAK",
    "continue": "CONTINUE"
}

export interface Token {
    type: TokenType;
    value?: string;
    line?: number;
}

export interface StringBuilderToken extends Token {
    type: "STRINGBUILDER";
    value: string;
    subExpressions?: Token[][]  
}

export class Tokenizer {
    private input: string;
    private index: number;
    private tokens: Token[];
    private currentLine: number;

    constructor(input: string) {
        this.input = input;
        this.index = 0;
        this.tokens = [];
        this.currentLine = 1;
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
            if (this.tryParseStringLiteral()) {
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
            this.tokens.push({ type: "EOS" , line: this.currentLine});
            this.index++;
            return true;
        }
        return false;
    }

    tryParseWhiteSpace(): boolean {
        const char = this.input[this.index];
        if (/\s/.test(char)) {
            if (char === "\n") {
                this.currentLine++;
            }
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
            this.tokens.push({ type: "NUMBER", value: numStr, line: this.currentLine });
            return true;
        }
        return false;
    }


    tryParseOperator(): boolean {
        let char = this.input[this.index];
        if (char === "(") {
            this.tokens.push({ type: "LPAREN", value: char, line: this.currentLine });
            this.index++;
            return true;
        }
        if (char === ")") {
            this.tokens.push({ type: "RPAREN", value: char, line: this.currentLine });
            this.index++;
            return true;
        }
        if (char === "[") {
            this.tokens.push({ type: "LBRACKET", value: char, line: this.currentLine });
            this.index++;
            return true;
        }
        if (char === "]") {
            this.tokens.push({ type: "RBRACKET", value: char, line: this.currentLine });
            this.index++;
            return true;
        }
        if (char === "{") {
            this.tokens.push({ type: "LBRACE", value: char, line: this.currentLine });
            this.index++;
            return true;
        }
        if (char === "}") {
            this.tokens.push({ type: "RBRACE", value: char, line: this.currentLine });
            this.index++;
            return true;
        }
        if (char === ".") {
            this.index++;
            if ((this.index < this.input.length-3) && (this.input[this.index] === ".") && (this.input[this.index + 1] === ".")) {
                this.tokens.push({ type: "ELLIPSIS", value: "...", line: this.currentLine });
                this.index+=2;
                return true;
            }
            else {
                this.tokens.push({ type: "MEMBER_ACCESS", value: char, line: this.currentLine });
            }
            
            
            return true;
        }
        if (char === "+") {
            this.index++;
            char = this.input[this.index];
            if (char === "+") {
                this.tokens.push({ type: "INCREMENT", value: "++" , line: this.currentLine});
                this.index++;
                return true;
            }
            else if (char === "=") {
                this.tokens.push({ type: "INCREMENT_ASSIGN", value: "+=", line: this.currentLine });
                this.index++;
                return true;
            }
            else {
                this.tokens.push({ type: "PLUS", value: '+', line: this.currentLine });
            }
            return true;
        }
        if (char === "-") {
            this.index++;
            char = this.input[this.index];
            if (char === "-") {
                this.tokens.push({ type: "DECREMENT", value: "--", line: this.currentLine });
                this.index++;
                return true;
            }
            else if (char === "=") {
                this.tokens.push({ type: "DECREMENT_ASSIGN", value: "-=", line: this.currentLine });
                this.index++;
                return true;
            }
            else {
                this.tokens.push({ type: "MINUS", value: '-', line: this.currentLine });
            }
            return true;
        }
        // Multiply
        if (char === "*") {
            this.index++;
            char = this.input[this.index];
            // Power
            if (char === "*") {
                this.tokens.push({ type: "POWER", value: "**", line: this.currentLine });
                this.index++;
                return true;
            }
            // Multiply assign
            else if (char === "=") {
                this.tokens.push({ type: "MULTIPLY_ASSIGN", value: "*=", line: this.currentLine });
                this.index++;
                return true;
            }
            else {
                this.tokens.push({ type: "MULTIPLY", value: '*', line: this.currentLine });
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
                this.tokens.push({ type: "SQRT", value: "*/", line: this.currentLine });
                this.index++;
                return true;
            }
            // Divide assign
            else if (char === "=") {
                this.tokens.push({ type: "DIVIDE_ASSIGN", value: "/=", line: this.currentLine });
                this.index++;
                return true;
            }
            else {
                this.tokens.push({ type: "DIVIDE", value: '/', line: this.currentLine });
            }
            return true;
        }
        // Modulo
        if (char === "%") {
            this.index++;
            char = this.input[this.index];
            if (char === "=") {
                this.tokens.push({ type: "MODULO_ASSIGN", value: "%=", line: this.currentLine });
                this.index++;
                return true;
            }
            else {
                this.tokens.push({ type: "MODULO", value: "%", line: this.currentLine });
            }
            return true;
        }

        if (char === "=") {
            this.index++;
            char = this.input[this.index];
            if (char === "=") {
                this.tokens.push({ type: "EQUALITY", value: "==", line: this.currentLine });
                this.index++;
                return true;
            }
            else {
                this.tokens.push({ type: "ASSIGN", value: "=", line: this.currentLine });
            }
            return true;
        }

        if (char === "<") {
            this.index++;
            char = this.input[this.index];
            if (char === "=") {
                this.tokens.push({ type: "LESS_THAN_OR_EQUAL", value: "<=", line: this.currentLine });
                this.index++;
                return true;
            }
            else {
                this.tokens.push({ type: "LESS_THAN", value: "<", line: this.currentLine });
            }
            return true;
        }

        if (char === ">") {
            this.index++;
            char = this.input[this.index];
            if (char === "=") {
                this.tokens.push({ type: "GREATER_THAN_OR_EQUAL", value: ">=", line: this.currentLine });
                this.index++;
                return true;
            }
            else {
                this.tokens.push({ type: "GREATER_THAN", value: ">", line: this.currentLine });
            }
            return true;
        }

        if (char === "!") {
            this.index++;
            char = this.input[this.index];
            if (char === "=") {
                this.tokens.push({ type: "INEQUALITY", value: "!=", line: this.currentLine });
                this.index++;
                return true;
            }
            else {
                this.tokens.push({ type: "NOT", value: "!", line: this.currentLine });
            }
        }

        if (char === "&") {
            this.index++;
            char = this.input[this.index];
            if (char === "&") {
                this.tokens.push({ type: "AND", value: "&&", line: this.currentLine });
                this.index++;
                return true;
            }
            else {
                this.tokens.push({ type: "BITWISE_AND", value: "&", line: this.currentLine });
            }
            return true;
        }

        if (char === "|") {
            this.index++;
            char = this.input[this.index];
            if (char === "|") {
                this.tokens.push({ type: "OR", value: "||", line: this.currentLine });
                this.index++;
                return true;
            }
            else {
                this.tokens.push({ type: "BITWISE_OR", value: "|", line: this.currentLine });
            }
            return true;
        }

        if (char === ",") {
            this.tokens.push({ type: "COMMA", value: ",", line: this.currentLine });
            this.index++;
            return true;
        }

        if (char === ":") {
            this.tokens.push({ type: "COLON", value: ":", line: this.currentLine });
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
                this.tokens.push({ type: keywordTokenMap[identifier], value: identifier, line: this.currentLine });
                return true;
            }
            else {
                this.tokens.push({ type: "IDENTIFIER", value: identifier, line: this.currentLine });
            }
            
            return true;
        }
        return false;
    }

    private tryParseSpecialChar(): string | null {
        let localIndex = this.index;
        let char = this.input[localIndex];
        
        if (char === "\\") {
            localIndex++;
            char += this.input[localIndex];
            return char;
        }
        return null;
    }
    tryParseStringLiteral(): boolean {
        const char = this.input[this.index];
        if (char === '"') {
            let str = '';
            this.index++;
            while (this.index < this.input.length && this.input[this.index] !== '"') {
                if(this.tryParseSpecialChar()=='\\"') {
                    this.index += 2;
                    str += '"';
                }
                str += this.input[this.index];
                this.index++;
            }
            this.index++;
            this.tokens.push({ type: "STRINGLITERAL", value: str, line: this.currentLine });
            return true;
        }
        else if (char === "'") {
            let str = '';
            this.index++;
            while (this.index < this.input.length && this.input[this.index] !== "'") {
                if(this.tryParseSpecialChar()=="\\'") {
                    this.index += 2;
                    str += "'";
                }
                str += this.input[this.index];
                this.index++;
            }
            this.index++;
            this.tokens.push({ type: "STRINGLITERAL", value: str, line: this.currentLine });
            return true;
        }
        else if (char === "`") {
            let str = '';
            this.index++;
            let terminatorStack = ['`'];
          
            while (this.index < this.input.length) {
              let currentChar = this.input[this.index];
          
              // Handle escaped backtick: \`
              if (currentChar === '\\' && this.input[this.index + 1] === '`') {
                str += '`';
                this.index += 2;
                continue;
              }
          
              // Check if we're starting a template expression: ${
              if (currentChar === '$' && this.input[this.index + 1] === '{') {
                // Push the closing brace onto the stack
                terminatorStack.push('}');
                str += '${';
                this.index += 2;
                continue;
              }
          
              // If we encounter a '{' inside a template expression block,
              // we might want to track balanced braces. If you want strictly JS-like nesting:
              if (terminatorStack.at(-1) === '}' && currentChar === '{') {
                // Another nested block inside the template expression
                terminatorStack.push('}');
                str += '{';
                this.index++;
                continue;
              }
          
              // If we see a '}' and the top of stack is '}', this might close a template block
              if (currentChar === '}' && terminatorStack.at(-1) === '}') {
                terminatorStack.pop();
                str += '}';
                this.index++;
                continue;
              }
          
              // Check if we reached an unescaped backtick while not inside any template expressions
              if (
                currentChar === '`' &&
                terminatorStack.length === 1 &&
                terminatorStack[0] === '`'
              ) {
                // We've found the terminating backtick
                this.index++;
                break;
              }
          
              // Otherwise, just append the current character
              str += currentChar;
              this.index++;
            }
            
            // Tokenize the sub-expressions in the string
            // Start by extracting the expressions
            const re = /\$\{(.+?)\}/g;
            const originalString = str;
            const expressions = [...(originalString.matchAll(re) as IterableIterator<RegExpExecArray>)].map((match) => match[1]);
            // Replace the expressions with placeholders
            let index = 0;
            const newString = originalString.replace(re, () => {
                return `\${${index++}}`;
            });

            this.tokens.push({ 
                type: "STRINGBUILDER", 
                value: newString,
                subExpressions: expressions.map((expression) => {
                    return new Tokenizer(expression).tokenize();
                }),
                line: this.currentLine
            } as StringBuilderToken);

            return true;
        }
        return false;
    }
}