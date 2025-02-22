

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

    "INFINITY" |

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
    "QUESTION_MARK" |

    "MEMBER_ACCESS" |
    "NULL_COALESCING" |

    "IF" |
    "ELSE" |
    "WHILE" |
    "RETURN" |
    "BREAK" |
    "CONTINUE" |
    "FOR" |
    "IN" |
    "NOT_IN" |
    "DECLARE_VARIABLE" |
    "DECLARE_CONSTANT" |
    "FUNCTION" |
    "TRY" |
    "CATCH" |
    "EOS" |
    "EOF" |

    "UNKNOWN" |
    "COMMENT" |
    "WHITESPACE"
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
    rawValue?: string;
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
    private options: { 
        allowUnknown?: boolean, 
        disableReplacements?: boolean, 
        keepWhitespace?: boolean, 
        keepComments?: boolean 
    };

    constructor(input: string, params?: { allowUnknown?: boolean, disableReplacements?: boolean, keepWhitespace?: boolean, keepComments?: boolean }) {
        this.input = input;
        this.index = 0;
        this.tokens = [];
        this.currentLine = 1;
        this.options = {
            allowUnknown: params?.allowUnknown || false,
            disableReplacements: params?.disableReplacements || false,
            keepWhitespace: params?.keepWhitespace || false,
            keepComments: params?.keepComments || false
        }
    }

    replaceAlternateRepresentations(code: string) {
        // replace ... with elipsis unicode character
        code = code.replace(/\.\.\./g, "…");

        return code;
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
            
            if (this.options.allowUnknown) {
                this.tokens.push({ type: "UNKNOWN", value: this.input[i], line: this.currentLine });
                this.index++;
                continue;
            }

            throw new Error(`Unexpected token at index ${i} line ${this.currentLine}`);
        }

        this.tokens.push({ type: "EOF" });
        return this.tokens;
    }

    /**
     * Try to parse an end of statement token
     * @returns 
     */
    tryParseEOS(): boolean {
        const char = this.input[this.index];
        if (char === ";") {
            this.tokens.push({ type: "EOS" , value: ";", line: this.currentLine, rawValue: ";" });
            this.index++;
            return true;
        }
        return false;
    }

    /**
     * Try to parse whitespace
     * Will add a whitespace token if the option is set
     * @returns 
     */
    tryParseWhiteSpace(): boolean {
        let outputValue = "";
        while (this.index < this.input.length && /\s/.test(this.input[this.index])) {
            const char = this.input[this.index];
            if (char === "\n") {
                this.currentLine++;
            }
            outputValue += char;
            this.index++;
            continue;
        }
        // Keep whitespace if the option is set
        if (outputValue.length > 0 && this.options.keepWhitespace) {
            this.tokens.push({ type: "WHITESPACE", value: outputValue, line: this.currentLine, rawValue: outputValue });
        }
        return outputValue.length > 0;
    }

    /**
     * Parse a number literal
     * @returns 
     */
    tryParseNumber(): boolean {
        const char = this.input[this.index];
        if ("0123456789".includes(char)) {
            let numStr = char;
            let hasDecimal = false;
            this.index++;
            while (this.index < this.input.length && "0123456789._".includes(this.input[this.index])) {
                if (this.input[this.index] === ".") {
                    // exit early if we have a decimal followed by another decimal
                    // This is to allow for the ellipsis operator
                    if (this.input[this.index + 1] === "." || hasDecimal) {
                        this.tokens.push({ type: "NUMBER", value: numStr.replace('_', ''), line: this.currentLine, rawValue: numStr });
                        return true;
                    }
                    hasDecimal = true;
                }
                numStr += this.input[this.index];
                this.index++;
            }
            this.tokens.push({ type: "NUMBER", value: numStr.replace('_', ''), line: this.currentLine, rawValue: numStr });
            return true;
        }
        return false;
    }


    tryParseOperator(): boolean {
        let char = this.input[this.index];
        if (char === "(") {
            this.tokens.push({ type: "LPAREN", value: char, line: this.currentLine, rawValue: char });
            this.index++;
            return true;
        }
        if (char === ")") {
            this.tokens.push({ type: "RPAREN", value: char, line: this.currentLine, rawValue: char });
            this.index++;
            return true;
        }
        if (char === "[") {
            this.tokens.push({ type: "LBRACKET", value: char, line: this.currentLine, rawValue: char });
            this.index++;
            return true;
        }
        if (char === "]") {
            this.tokens.push({ type: "RBRACKET", value: char, line: this.currentLine, rawValue: char });
            this.index++;
            return true;
        }
        if (char === "{") {
            this.tokens.push({ type: "LBRACE", value: char, line: this.currentLine, rawValue: char });
            this.index++;
            return true;
        }
        if (char === "}") {
            this.tokens.push({ type: "RBRACE", value: char, line: this.currentLine, rawValue: char });
            this.index++;
            return true;
        }
        if (char === ".") {
            this.index++;
            if ((this.index < this.input.length-3) && (this.input[this.index] === ".") && (this.input[this.index + 1] === ".")) {
                this.tokens.push({ type: "ELLIPSIS", value: "…", line: this.currentLine, rawValue: "...", });
                this.index+=2;
                return true;
            }
            else {
                this.tokens.push({ type: "MEMBER_ACCESS", value: char, line: this.currentLine, rawValue: char });
            }
            
            
            return true;
        }
        if (char === "+") {
            this.index++;
            char = this.input[this.index];
            if (char === "+") {

                if (this.options.disableReplacements) {
                    this.tokens.push({ type: "INCREMENT", value: "++", line: this.currentLine, rawValue: "++" });
                }
                else {
                    this.tokens.push({ type: "INCREMENT_ASSIGN", value: "+=", line: this.currentLine, rawValue: "++" });
                    this.tokens.push({ type: "NUMBER", value: "1", line: this.currentLine, rawValue: "" });
                }
                this.index++;
                return true;
            }
            else if (char === "=") {
                this.tokens.push({ type: "INCREMENT_ASSIGN", value: "+=", line: this.currentLine, rawValue: "+=" });
                this.index++;
                return true;
            }
            else {
                this.tokens.push({ type: "PLUS", value: '+', line: this.currentLine, rawValue: "+" });
            }
            return true;
        }
        if (char === "-") {
            this.index++;
            char = this.input[this.index];
            if (char === "-") {
                if (this.options.disableReplacements) {
                    this.tokens.push({ type: "DECREMENT", value: "--", line: this.currentLine, rawValue: "--" });
                }
                else {
                    this.tokens.push({ type: "DECREMENT_ASSIGN", value: "-=", line: this.currentLine, rawValue: "--" });
                    this.tokens.push({ type: "NUMBER", value: "1", line: this.currentLine, rawValue: "" });
                }
                this.index++;
                return true;
            }
            else if (char === "=") {
                this.tokens.push({ type: "DECREMENT_ASSIGN", value: "-=", line: this.currentLine, rawValue: "-=" });
                this.index++;
                return true;
            }
            else {
                this.tokens.push({ type: "MINUS", value: '-', line: this.currentLine, rawValue: "-" });
            }
            return true;
        }
        // Multiply
        if (char === "*") {
            this.index++;
            char = this.input[this.index];
            // Power
            if (char === "*") {
                this.tokens.push({ type: "POWER", value: "**", line: this.currentLine, rawValue: "**" });
                this.index++;
                return true;
            }
            // Multiply assign
            else if (char === "=") {
                this.tokens.push({ type: "MULTIPLY_ASSIGN", value: "*=", line: this.currentLine, rawValue: "*=" });
                this.index++;
                return true;
            }
            else {
                this.tokens.push({ type: "MULTIPLY", value: '*', line: this.currentLine, rawValue: "*" });
            }
            return true;
        }
        // Divide
        if (char === "/") {                 
            this.index++;
            char = this.input[this.index];
            // Comment
            if (char === "/") {
                const startIndex = this.index-1;
                while (this.index < this.input.length && this.input[this.index] !== "\n") {
                    this.index++;
                }
                if (this.options.keepComments) {
                    const val = this.input.substring(startIndex, this.index);
                    this.tokens.push({ type: "COMMENT", value: val, line: this.currentLine, rawValue: val });
                }
                return true;
            }
            // Block comment
            if (char === "*") {
                const startIndex = this.index-1;

                this.index++;
                while (this.index < this.input.length-1) {
                    if (this.input[this.index] === "*" && this.input[this.index + 1] === "/") {
                        this.index += 2;
                        break;
                    }
                    this.index++;
                }
                if (this.options.keepComments) {
                    const val = this.input.substring(startIndex, this.index);
                    this.tokens.push({ type: "COMMENT", value: val, line: this.currentLine, rawValue: val });
                }
                return true;
            }
            // sqrt
            else if (char === "/") {
                this.tokens.push({ type: "SQRT", value: "*/", line: this.currentLine, rawValue: "*/" });
                this.index++;
                return true;
            }
            // Divide assign
            else if (char === "=") {
                this.tokens.push({ type: "DIVIDE_ASSIGN", value: "/=", line: this.currentLine, rawValue: "/=" });
                this.index++;
                return true;
            }
            else {
                this.tokens.push({ type: "DIVIDE", value: '/', line: this.currentLine, rawValue: "/" });
            }
            return true;
        }
        // Modulo
        if (char === "%") {
            this.index++;
            char = this.input[this.index];
            if (char === "=") {
                this.tokens.push({ type: "MODULO_ASSIGN", value: "%=", line: this.currentLine, rawValue: "%=" });
                this.index++;
                return true;
            }
            else {
                this.tokens.push({ type: "MODULO", value: "%", line: this.currentLine, rawValue: "%" });
            }
            return true;
        }

        if (char === "=") {
            this.index++;
            char = this.input[this.index];
            if (char === "=") {
                this.tokens.push({ type: "EQUALITY", value: "==", line: this.currentLine, rawValue: "==" });
                this.index++;
                return true;
            }
            else {
                this.tokens.push({ type: "ASSIGN", value: "=", line: this.currentLine, rawValue: "=" });
            }
            return true;
        }

        if (char === "<") {
            this.index++;
            char = this.input[this.index];
            if (char === "=") {
                this.tokens.push({ type: "LESS_THAN_OR_EQUAL", value: "<=", line: this.currentLine, rawValue: "<=" });
                this.index++;
                return true;
            }
            else {
                this.tokens.push({ type: "LESS_THAN", value: "<", line: this.currentLine, rawValue: "<" });
            }
            return true;
        }

        if (char === ">") {
            this.index++;
            char = this.input[this.index];
            if (char === "=") {
                this.tokens.push({ type: "GREATER_THAN_OR_EQUAL", value: ">=", line: this.currentLine, rawValue: ">=" });
                this.index++;
                return true;
            }
            else {
                this.tokens.push({ type: "GREATER_THAN", value: ">", line: this.currentLine, rawValue: ">" });
            }
            return true;
        }

        if (char === "!") {
            this.index++;
            char = this.input[this.index];
            if (char === "=") {
                this.tokens.push({ type: "INEQUALITY", value: "!=", line: this.currentLine, rawValue: "!=" });
                this.index++;
                return true;
            }
            else {
                this.tokens.push({ type: "NOT", value: "!", line: this.currentLine, rawValue: "!" });
            }
        }

        if (char === "?") {
            this.index++;
            char = this.input[this.index];
            if (char === ".") {
                this.tokens.push({ type: "NULL_COALESCING", value: "?.", line: this.currentLine, rawValue: "?." });
                this.index++;
                return true;
            }
            else {
                this.tokens.push({ type: "QUESTION_MARK", value: "?", line: this.currentLine, rawValue: "?" });
                return true;
            }
        }

        if (char === "&") {
            this.index++;
            char = this.input[this.index];
            if (char === "&") {
                this.tokens.push({ type: "AND", value: "&&", line: this.currentLine, rawValue: "&&" });
                this.index++;
                return true;
            }
            else {
                this.tokens.push({ type: "BITWISE_AND", value: "&", line: this.currentLine, rawValue: "&" });
            }
            return true;
        }

        if (char === "|") {
            this.index++;
            char = this.input[this.index];
            if (char === "|") {
                this.tokens.push({ type: "OR", value: "||", line: this.currentLine, rawValue: "||" });
                this.index++;
                return true;
            }
            else {
                this.tokens.push({ type: "BITWISE_OR", value: "|", line: this.currentLine, rawValue: "|" });
            }
            return true;
        }

        if (char === ",") {
            this.tokens.push({ type: "COMMA", value: ",", line: this.currentLine, rawValue: "," });
            this.index++;
            return true;
        }

        if (char === ":") {
            this.tokens.push({ type: "COLON", value: ":", line: this.currentLine, rawValue: ":" });
            this.index++;
            return true;
        }

        if (char === "…") {
            this.tokens.push({ type: "ELLIPSIS", value: "…", line: this.currentLine, rawValue: "…" });
            this.index++;
            return true;
        }

        if (char === "∈") {
            this.tokens.push({ type: "IN", value: "∈", line: this.currentLine, rawValue: "∈" });
            this.index++;
            return true;
        }

        if (char === "∉") {
            this.tokens.push({ type: "NOT_IN", value: "∈", line: this.currentLine, rawValue: "∈" });
            this.index++;
            return true;
        } 

        if (char === "∞") {
            this.tokens.push({ type: "INFINITY", value: "∞", line: this.currentLine, rawValue: "∞" });
            this.index++;
            return true;
        }



        return false;
    }

    /**
     * Try to parse an identifier
     * @returns 
     */
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
                this.tokens.push({ type: keywordTokenMap[identifier], value: identifier, line: this.currentLine, rawValue: identifier });
                return true;
            }
            else {
                this.tokens.push({ type: "IDENTIFIER", value: identifier, line: this.currentLine, rawValue: identifier });
            }
            
            return true;
        }
        return false;
    }


    private tryParseSpecialChar(): string | null {
        let localIndex = this.index;
        let char = this.input[localIndex];

        if (char === String.raw`\\`) {
            localIndex++;
            char += this.input[localIndex];

            return char;
        }
        return null;
    }
    /**
     * Try to parse a string literal
     * @returns 
     */
    tryParseStringLiteral(): boolean {
        const char = this.input[this.index];
        if (char === '"') {
            let str = '"';
            this.index++;
            while (this.index < this.input.length) {
                if(this.tryParseSpecialChar()=='\\"') {
                    this.index += 2;
                    str += '"';
                    continue;
                }
                str += this.input[this.index];

                if (this.input[this.index] === '"') {
                    this.index++;
                    break;
                }
                this.index++;
            }
            
            this.tokens.push({ type: "STRINGLITERAL", value: str, line: this.currentLine, rawValue: str });
            return true;
        }
        else if (char === "'") {
            let str = "'";
            this.index++;
            while (this.index < this.input.length) {
                if(this.tryParseSpecialChar()=="\'") {
                    this.index += 2;
                    str += "'";
                    continue;
                }
                str += this.input[this.index];

                if(this.input[this.index] === "'") {
                    this.index++;
                    break;
                }
                this.index++;
            }
            this.tokens.push({ type: "STRINGLITERAL", value: str, line: this.currentLine, rawValue: str });
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
                value: "`"+newString+"`",
                subExpressions: expressions.map((expression) => {
                    return new Tokenizer(expression).tokenize();
                }),
                line: this.currentLine,
                rawValue: "`"+originalString+"`",
            } as StringBuilderToken);

            return true;
        }
        return false;
    }
}