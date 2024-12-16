"use strict";
// -------------------- Tokenizer --------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tokenizer = exports.keywordTokenMap = void 0;
exports.keywordTokenMap = {
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
};
class Tokenizer {
    constructor(input) {
        this.input = input;
        this.index = 0;
        this.tokens = [];
    }
    tokenize() {
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
    tryParseEOS() {
        const char = this.input[this.index];
        if (char === ";") {
            this.tokens.push({ type: "EOS" });
            this.index++;
            return true;
        }
        return false;
    }
    tryParseWhiteSpace() {
        const char = this.input[this.index];
        if (/\s/.test(char)) {
            this.index++;
            return true;
        }
        return false;
    }
    tryParseNumber() {
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
    tryParseOperator() {
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
                this.tokens.push({ type: "PLUS", value: '+' });
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
                while (this.index < this.input.length - 1) {
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
    tryParseIdentifier() {
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
            if (exports.keywordTokenMap[identifier]) {
                this.tokens.push({ type: exports.keywordTokenMap[identifier] });
                return true;
            }
            else {
                this.tokens.push({ type: "IDENTIFIER", value: identifier });
            }
            return true;
        }
        return false;
    }
    tryParseSpecialChar() {
        let localIndex = this.index;
        let char = this.input[localIndex];
        if (char === "\\") {
            localIndex++;
            char += this.input[localIndex];
            return char;
        }
        return null;
    }
    tryParseStringLiteral() {
        const char = this.input[this.index];
        if (char === '"') {
            let str = '';
            this.index++;
            while (this.index < this.input.length && this.input[this.index] !== '"') {
                if (this.tryParseSpecialChar() == '\\"') {
                    this.index += 2;
                    str += '"';
                }
                str += this.input[this.index];
                this.index++;
            }
            this.index++;
            this.tokens.push({ type: "STRINGLITERAL", value: str });
            return true;
        }
        else if (char === "'") {
            let str = '';
            this.index++;
            while (this.index < this.input.length && this.input[this.index] !== "'") {
                if (this.tryParseSpecialChar() == "\\'") {
                    this.index += 2;
                    str += "'";
                }
                str += this.input[this.index];
                this.index++;
            }
            this.index++;
            this.tokens.push({ type: "STRINGLITERAL", value: str });
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
                if (currentChar === '`' &&
                    terminatorStack.length === 1 &&
                    terminatorStack[0] === '`') {
                    // We've found the terminating backtick
                    this.index++;
                    this.tokens.push({ type: "STRINGBUILDER", value: str });
                    return true;
                }
                // Otherwise, just append the current character
                str += currentChar;
                this.index++;
            }
            // If we got here, no closing backtick was found
            // You can decide how to handle this scenario, e.g. push a partial token or throw an error
            this.tokens.push({ type: "STRINGBUILDER", value: str });
            return true;
        }
        return false;
    }
}
exports.Tokenizer = Tokenizer;
