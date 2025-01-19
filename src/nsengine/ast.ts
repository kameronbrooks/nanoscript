
export interface ASTNode {
    type: string;
    line?: number;
    isKnownAtCompileTime?: boolean;
}

/**
 * Number node
 * Represents a number value
 */
export interface NumberNode extends ASTNode {
    type: "Number";
    value: number;
    dtype?: string;
    isKnownAtCompileTime: true;
}

/**
 * String node
 * Represents a string value
 */
export interface StringNode extends ASTNode {
    type: "String";
    value: string;
    isKnownAtCompileTime: true;
}

/**
 * Boolean node
 * Represents a boolean value
 */
export interface BooleanNode extends ASTNode {
    type: "Boolean";
    value: boolean;
    dtype: "bool";
    isKnownAtCompileTime: true;
}

/**
 * Null node
 * Represents a null value
 */
export interface NullNode extends ASTNode {
    type: "Null";
    isKnownAtCompileTime: true;
}

/**
 * StringBuilder node
 * Represents a string builder expression \`Hello ${name}\`
 */
export interface StringBuilderNode extends ASTNode {
    type: "StringBuilder";
    string: string;
    expressions: ASTNode[];
}

/**
 * Generic unary operation node
 * Represents a unary operation (+, -)
 */
export interface UnaryOpNode extends ASTNode {
    type: "UnaryOp";
    operator: string; // "+" or "-"
    operand: ASTNode;
    postfix?: boolean;
}

/**
 * Generic binary operation node
 * Represents a binary operation (+, -, *, /, %)
 */
export interface BinaryOpNode extends ASTNode {
    type: "BinaryOp";
    operator: string; // "+" or "-"
    left: ASTNode;
    right: ASTNode;
}

/**
 * Ternary operation node
 * Represents a ternary operation (a ? b : c)
 */
export interface TernaryOpNode extends ASTNode {
    type: "TernaryOp";
    condition: ASTNode;
    left: ASTNode;
    right: ASTNode;
}

/**
 * Identifier node
 * Represents a variable or function name
 */
export interface IdentifierNode extends ASTNode {
    type: "Identifier";
    value: string;
    isLvalue?: boolean;
}

/**
 * Assignment node
 * Represents an assignment (=, +=, -=, *=, /=, %=)
 */
export interface AssignmentNode extends ASTNode {
    type: "Assignment";
    operator: string;
    left: ASTNode;
    right: ASTNode;
}

/**
 * Statement node
 * Represents a statement
 */
export interface StatementNode extends ASTNode {
    type: "Statement";
    body: ASTNode;
}

/**
 * Block node
 * When a block of code is encountered
 */
export interface BlockNode extends ASTNode {
    type: "Block";
    statements: ASTNode[];
}

/**
 * The program node
 * The root node of the AST
 */
export interface ProgramNode extends ASTNode {
    type: "Program";
    statements: ASTNode[];
}

/**
 * Condition node
 * When an if statement is encountered
 */
export interface ConditionNode extends ASTNode {
    type: "Condition";
    condition: ASTNode;
    body?: ASTNode;
    elseBody?: ASTNode;
}

/**
 * Loop node
 * When a loop is encountered (for or while)
 */
export interface LoopNode extends ASTNode {
    type: "Loop";
    initializer?: ASTNode;
    condition?: ASTNode;
    increment?: ASTNode;
    body?: ASTNode;
}

/**
 * Break node
 * When a loop is broken out of
 */
export interface BreakNode extends ASTNode {
    type: "Break";
    level: number;
}

/**
 * Return node
 * When a function returns a value or ends the program
 */
export interface ReturnNode extends ASTNode {
    type: "Return";
    value?: ASTNode;
}

/**
 * Continue node
 * When a loop is continued
 */
export interface ContinueNode extends ASTNode {
    type: "Continue";
    level: number;
}

/**
 * Member access node 
 * When a member of an object is accessed 
 * a.b
 */
export interface MemberAccessNode extends ASTNode {
    type: "MemberAccess";
    object: ASTNode;
    member: ASTNode;
    nullCoalescing?: boolean;
}

/**
 * Indexer node
 * When an array or object is indexed 
 * a[b]
 */
export interface IndexerNode extends ASTNode {
    type: "Indexer";
    object: ASTNode;
    indices: ASTNode[];
}

/**
 * Function call node
 * When a function is called
 * 
 */
export interface FunctionCallNode extends ASTNode {
    type: "FunctionCall";
    left: ASTNode;
    arguments: ASTNode[];
    targetLocation: "internal" | "external" | "stack";
    requireReturn: boolean;
}

/**
 * Declaration node
 * When a variable is declared
 */
export interface DeclarationNode extends ASTNode {
    type: "Declaration";
    identifier: string;
    initializer?: ASTNode;
    dtype?: string;
    constant?: boolean;
}

/**
 * Function declaration node
 * When an internal function is declared
 */
export interface FunctionDeclarationNode extends ASTNode {
    type: "FunctionDeclaration";
    name: string;
    arguments: ASTNode[];
    body: ASTNode;
}

/**
 * Array literal node
 * When an array literal is encountered
 */
export interface ArrayLiteralNode extends ASTNode {
    type: "ArrayLiteral";
    elements: ASTNode[];
    dtype?: string;
    isKnownAtCompileTime?: boolean;
    compileTimeValue?: any[];
}

/**
 * Object literal node
 * When an object literal is encountered
 */
export interface ObjectLiteralNode extends ASTNode {
    type: "ObjectLiteral";
    properties: { key: string, value: ASTNode }[];
    isKnownAtCompileTime?: boolean;
    compileTimeValue?: any;
}

/**
 * Set literal node
 * When a set literal is encountered
 */
export interface SetLiteralNode extends ASTNode {
    type: "SetLiteral";
    elements: ASTNode[];
    dtype?: string;
    isKnownAtCompileTime?: boolean;
    compileTimeValue?: any[];
}

// =================================================================================================
// Helper functions to create AST nodes
// =================================================================================================

/**
 * Create a number node
 * @param value 
 * @returns 
 */
export function createNumberNode(value: number): NumberNode {
    return { type: "Number", value, isKnownAtCompileTime: true };
}

/**
 * Create a unary operation node
 * @param operator 
 * @param operand 
 * @returns 
 */
export function createUnaryOpNode(operator: string, operand: ASTNode): UnaryOpNode {
    return { type: "UnaryOp", operator, operand };
}

/**
 * Create a binary operation node
 * @param operator 
 * @param left 
 * @param right 
 * @returns 
 */
export function createBinaryOpNode(operator: string, left?: ASTNode, right?: ASTNode): BinaryOpNode {
    return { type: "BinaryOp", operator: operator, left: left as ASTNode, right: right as ASTNode };
}


export function isKnownAtCompileTime(node: ASTNode): boolean {
    if (node.type == "Number" || node.type == "String" || node.type == "Boolean" || node.type == "Null") {
        return true;
    }
    if (node.type == "UnaryOp") {
        return isKnownAtCompileTime((node as UnaryOpNode).operand);
    }
    if (node.type == "BinaryOp") {
        return isKnownAtCompileTime((node as BinaryOpNode).left) && isKnownAtCompileTime((node as BinaryOpNode).right);
    }
    if (node.type == "ArrayLiteral") {
        return (node as ArrayLiteralNode).elements.every((el) => isKnownAtCompileTime(el));
    }
    return false;
}

export function compileTimeSolve(node: ASTNode): ASTNode {
    if (node.type == "Number" || node.type == "String" || node.type == "Boolean" || node.type == "Null") {
        return node;
    }
    if (node.type == "UnaryOp") {
        let operand = compileTimeSolve((node as UnaryOpNode).operand);
        if (operand.type == "Number") {
            let value = (node as UnaryOpNode).operator == "-" ? -(operand as NumberNode).value : (operand as NumberNode).value;
            return {
                type: "Number",
                value,
                isKnownAtCompileTime: true
            } as NumberNode;
        }
    }
    if (node.type == "BinaryOp") {
        let left = compileTimeSolve((node as BinaryOpNode).left);
        let right = compileTimeSolve((node as BinaryOpNode).right);
        if (left.type == "Number" && right.type == "Number") {
            let value = 0;
            switch ((node as BinaryOpNode).operator) {
                case "+": value = (left as NumberNode).value + (right as NumberNode).value; break;
                case "-": value = (left as NumberNode).value - (right as NumberNode).value; break;
                case "*": value = (left as NumberNode).value * (right as NumberNode).value; break;
                case "/": value = (left as NumberNode).value / (right as NumberNode).value; break;
                case "%": value = (left as NumberNode).value % (right as NumberNode).value; break;
            }
            return {
                type: "Number",
                value,
                isKnownAtCompileTime: true
            } as NumberNode;
        }
    }
    if (node.type == "ArrayLiteral") {
        const elements = (node as ArrayLiteralNode).elements.map((el) => compileTimeSolve(el));
        const elementValues = elements.map((el) => ((el as any)?.value));

        return {
            type: "ArrayLiteral",
            elements: elements,
            isKnownAtCompileTime: true,
            compileTimeValue: elementValues
        } as ArrayLiteralNode;
    }
    if (node.type == "ObjectLiteral") {
        return {
            type: "ObjectLiteral",
            properties: (node as ObjectLiteralNode).properties.map((prop) => ({ key: prop.key, value: compileTimeSolve(prop.value) })),
            isKnownAtCompileTime: true
        } as ObjectLiteralNode;
    }


    return node;
}


/**
 * Estimate the number of nodes in an AST
 * @param node 
 * @returns 
 */
export function getASTNodeCount(node: ASTNode | null | undefined): number {
    if (!node) return 0;
    let count = 1;
    if (node.type == "BinaryOp") {
        count += getASTNodeCount((node as BinaryOpNode).left);
        count += getASTNodeCount((node as BinaryOpNode).right);
    }
    else if (node.type == "UnaryOp") {
        count += getASTNodeCount((node as UnaryOpNode).operand);
    }
    else if (node.type == "FunctionCall") {
        count += getASTNodeCount((node as FunctionCallNode).left);
        count += (node as FunctionCallNode).arguments.map((arg) => getASTNodeCount(arg)).reduce((a, b) => a + b, 0);
    }
    else if (node.type == "Indexer") {
        count += getASTNodeCount((node as IndexerNode).object);
        count += (node as IndexerNode).indices.map((arg) => getASTNodeCount(arg)).reduce((a, b) => a + b, 0);
    }
    else if (node.type == "MemberAccess") {
        count += getASTNodeCount((node as MemberAccessNode).object);
        count += getASTNodeCount((node as MemberAccessNode).member);
    }
    else if (node.type == "Block") {
        count += (node as BlockNode).statements.map((stmt) => getASTNodeCount(stmt)).reduce((a, b) => a + b, 0);
    }
    else if (node.type == "Program") {
        count += (node as ProgramNode).statements.map((stmt) => getASTNodeCount(stmt)).reduce((a, b) => a + b, 0);
    }
    else if (node.type == "Condition") {
        count += getASTNodeCount((node as ConditionNode).condition);
        count += getASTNodeCount((node as ConditionNode)?.body);
        count += getASTNodeCount((node as ConditionNode).elseBody);
    }
    else if (node.type == "Loop") {
        count += getASTNodeCount((node as LoopNode).initializer);
        count += getASTNodeCount((node as LoopNode).condition);
        count += getASTNodeCount((node as LoopNode).increment);
        count += getASTNodeCount((node as LoopNode).body);
    }
    else if (node.type == "Declaration") {
        count += getASTNodeCount((node as DeclarationNode).initializer);
    }
    else if (node.type == "FunctionDeclaration") {
        count += (node as FunctionDeclarationNode).arguments.map((arg) => getASTNodeCount(arg)).reduce((a, b) => a + b, 0);
        count += getASTNodeCount((node as FunctionDeclarationNode).body);
    }
    else if (node.type == "Return") {
        count += getASTNodeCount((node as ReturnNode).value);
    }
    else if (node.type == "ArrayLiteral") {
        count += (node as ArrayLiteralNode).elements.map((arg) => getASTNodeCount(arg)).reduce((a, b) => a + b, 0);
    }
    return count;
}

/**
 * Get the string representation of an AST to print to the console
 * @param node 
 * @param level 
 * @returns 
 */
export function astToString(node: ASTNode, level: number = 0): string {
    let indent = `\x1b[${level + 32}m` + "--".repeat(level);
    let postfix = level == 0 ? "\x1b[0m" : "";
    const arrow = (level > 1) ? "↳" : "";
    if (!node) return "";

    let a, b, c, d, e;
    switch (node.type) {
        case "Null":
            return indent + `[null]\n` + postfix;
        case "Boolean":
            return indent + `[${(node as BooleanNode).value.toString()}]\n` + postfix
        case "Number":
            return indent + `[${(node as NumberNode).value.toString()}]\n` + postfix;
        case "ArrayLiteral":
            return indent + `[Array]:\n${(node as ArrayLiteralNode).elements.map((el) => astToString(el, level + 1)).join("")}` + postfix;
        case "ObjectLiteral":
            return indent + `[Object]:\n${(node as ObjectLiteralNode).properties.map((prop) => indent + `[${prop.key}]:\n${astToString(prop.value, level + 1)}`).join("")}` + postfix;
        case "SetLiteral":
            return indent + `[Set]:\n${(node as SetLiteralNode).elements.map((el) => astToString(el, level + 1)).join("")}` + postfix;
        case "UnaryOp":
            return indent + `[${(node as UnaryOpNode).operator}]:\n${astToString((node as UnaryOpNode).operand, level + 1)}` + postfix;
        case "BinaryOp":
            return indent + `[${(node as BinaryOpNode).operator}]:\n${astToString((node as BinaryOpNode).left, level + 1)}${astToString((node as BinaryOpNode).right, level + 1)}` + postfix;
        case "Assignment":
            return indent + `[${(node as AssignmentNode).operator}]:\n${astToString((node as AssignmentNode).left, level + 1)}${astToString((node as AssignmentNode).right, level + 1)}` + postfix;
        case "Identifier":
            return indent + `[${(node as IdentifierNode).value}]\n` + postfix;
        case "MemberAccess":
            return indent + `[.]:\n${astToString((node as MemberAccessNode).object, level + 1)}${astToString((node as MemberAccessNode).member, level + 1)}` + postfix;
        case "FunctionCall":
            a = (node as FunctionCallNode).requireReturn ? '[()->{}] -> x' : '[()->{}] -> void';
            return indent + `${a}:\n${astToString((node as FunctionCallNode).left, level + 1)}` + (node as FunctionCallNode).arguments.map((arg) => astToString(arg, level + 1)).join("") + postfix;
        case "Indexer":
            return indent + `[[]]:\n${astToString((node as IndexerNode).object, level + 1)}` + (node as IndexerNode).indices.map((arg) => astToString(arg, level + 1)).join("") + postfix;
        case "String":
            return indent + `["${(node as StringNode).value}"]\n` + postfix;
        case "StringBuilder":
            return indent + `[StringBuilder (${(node as StringBuilderNode).string})]:\n${(node as StringBuilderNode).expressions.map((expr) => astToString(expr, level + 1)).join("")}` + postfix;
        case "Block":
            return indent + `[Block]:\n${(node as BlockNode).statements.map((stmt) => astToString(stmt, level + 1)).join("")}` + postfix;
        case "Condition":
            a = indent + `[If]:\n`;
            a += astToString((node as ConditionNode).condition, level + 1);
            if ((node as ConditionNode).body) {
                a += indent + `[Then]:\n`;
                a += astToString((node as ConditionNode).body as ASTNode, level + 1);
            }
            if ((node as ConditionNode).elseBody) {
                a += indent + `[Else]:\n`;
                a += astToString((node as ConditionNode).elseBody as ASTNode, level + 1);
            }
            return a + postfix;
        case "Loop":
            a = indent + `[Loop]:\n`;
            if ((node as LoopNode).initializer) {
                a += indent + `[Initializer]:\n`;
                a += astToString((node as LoopNode).initializer as ASTNode, level + 1);
            }
            if ((node as LoopNode).condition) {
                a += indent + `[Condition]:\n`;
                a += astToString((node as LoopNode).condition as ASTNode, level + 1);
            }
            if ((node as LoopNode).increment) {
                a += indent + `[Increment]:\n`;
                a += astToString((node as LoopNode).increment as ASTNode, level + 1);
            }
            if ((node as LoopNode).body) {
                a += indent + `[Body]:\n`;
                a += astToString((node as LoopNode).body as ASTNode, level + 1);
            }
            return a + postfix;
        case "Declaration":
            a = indent + `[Declare]:\n`;
            a += indent + `[${(node as DeclarationNode).identifier}]\n`;
            if ((node as DeclarationNode).initializer) {
                a += astToString((node as DeclarationNode).initializer as ASTNode, level + 1);
            }
            return a + postfix;
        case "FunctionDeclaration":
            a = indent + `[Function]:\n`;
            a += indent + `[${(node as FunctionDeclarationNode).name}]\n`;
            a += indent + `[Arguments]:\n`;
            a += (node as FunctionDeclarationNode).arguments.map((arg) => astToString(arg, level + 1)).join("");
            a += indent + `[Body]:\n`;
            a += astToString((node as FunctionDeclarationNode).body as ASTNode, level + 1);
            return a + postfix;
        case "Return":
            a = indent + `[Return]:\n`;
            if ((node as ReturnNode).value) {
                a += astToString((node as ReturnNode).value as ASTNode, level + 1);
            }
            return a + postfix;
        case "Break":
            return indent + `[Break]:\n` + postfix;
        case "Continue":
            return indent + `[Continue]:\n` + postfix;
        case "Program":
            return indent + `[Program]:\n${(node as ProgramNode).statements.map((stmt) => astToString(stmt, level + 1)).join("")}` + postfix;
        default:
            return `Unknown ASTNode type ${node.type}`;
    }
}