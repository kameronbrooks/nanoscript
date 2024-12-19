
export interface ASTNode {
    type: string;
}

export interface NumberNode extends ASTNode {
    type: "Number";
    value: number;
    dtype?: string;
}
export interface StringNode extends ASTNode {
    type: "String";
    value: string;
}
export interface BooleanNode extends ASTNode {
    type: "Boolean";
    value: boolean;
    dtype: "bool";
}
export interface NullNode extends ASTNode {
    type: "Null";
}
export interface StringBuilderNode extends ASTNode {
    type: "StringBuilder";
    string: string;
    expressions: ASTNode[];
}

export interface UnaryOpNode extends ASTNode {
    type: "UnaryOp";
    operator: string; // "+" or "-"
    operand: ASTNode;
    postfix?: boolean;
}

export interface BinaryOpNode extends ASTNode {
    type: "BinaryOp";
    operator: string; // "+" or "-"
    left: ASTNode;
    right: ASTNode;
}
export interface IdentifierNode extends ASTNode {
    type: "Identifier";
    value: string;
    isLvalue?: boolean;
}
export interface AssignmentNode extends ASTNode {
    type: "Assignment";
    operator: string;
    left: ASTNode;
    right: ASTNode;
}
export interface StatementNode extends ASTNode {
    type: "Statement";
    body: ASTNode;
}
export interface BlockNode extends ASTNode {
    type: "Block";
    statements: ASTNode[];
}
export interface ConditionNode extends ASTNode {
    type: "Condition";
    condition: ASTNode;
    body?: ASTNode;
    elseBody?: ASTNode;
}
export interface LoopNode extends ASTNode {
    type: "Loop";
    initializer?: ASTNode;
    condition?: ASTNode;
    increment?: ASTNode;
    body?: ASTNode;
}

export interface MemberAccessNode extends ASTNode {
    type: "MemberAccess";
    object: ASTNode;
    member: ASTNode;
}

export interface IndexerNode extends ASTNode {
    type: "Indexer";
    object: ASTNode;
    indices: ASTNode[];
}

export interface FunctionCallNode extends ASTNode {
    type: "FunctionCall";
    left: ASTNode;
    arguments: ASTNode[];
}

export interface DeclarationNode extends ASTNode {
    type: "Declaration";
    identifier: string;
    initializer?: ASTNode;
    dtype?: string;
    constant?: boolean;
}

export function createNumberNode(value: number): NumberNode {
    return { type: "Number", value };
}

export function createUnaryOpNode(operator: string, operand: ASTNode): UnaryOpNode {
    return { type: "UnaryOp", operator, operand };
}

export function createBinaryOpNode(operator: string, left?: ASTNode, right?: ASTNode): BinaryOpNode {
    return { type: "BinaryOp", operator: operator, left: left as ASTNode, right: right as ASTNode};
}

export function astToString(node: ASTNode, level:number=0): string {
    let indent = `\x1b[${level+32}m` + "--".repeat(level);
    let postfix = level==0 ? "\x1b[0m" : "";
    const arrow = (level>1) ? "↳" : "";
    if(!node) return "";

    let a, b, c, d, e;
    switch(node.type) {
        case "Number":
            return indent+`[${(node as NumberNode).value.toString()}]\n` + postfix;
        case "UnaryOp":
            return indent+`[${(node as UnaryOpNode).operator}]:\n${astToString((node as UnaryOpNode).operand, level+1)}` + postfix;
        case "BinaryOp":
            return indent+`[${(node as BinaryOpNode).operator}]:\n${astToString((node as BinaryOpNode).left, level+1)}${astToString((node as BinaryOpNode).right, level+1)}` + postfix;
        case "Assignment":
            return indent+`[${(node as AssignmentNode).operator}]:\n${astToString((node as AssignmentNode).left, level+1)}${astToString((node as AssignmentNode).right, level+1)}` + postfix;
        case "Identifier":
            return indent+`[${(node as IdentifierNode).value}]\n` + postfix;
        case "MemberAccess":
            return indent+`[.]:\n${astToString((node as MemberAccessNode).object, level+1)}${astToString((node as MemberAccessNode).member, level+1)}` + postfix;
        case "FunctionCall":
            return indent+`[()->{}]:\n${astToString((node as FunctionCallNode).left, level+1)}` + (node as FunctionCallNode).arguments.map((arg) => astToString(arg, level+1)).join("") + postfix;
        case "Indexer":
            return indent+`[[]]:\n${astToString((node as IndexerNode).object, level+1)}` + (node as IndexerNode).indices.map((arg) => astToString(arg, level+1)).join("") + postfix;
        case "String":
            return indent+`["${(node as StringNode).value}"]\n` + postfix;
        case "StringBuilder":
            return indent+`[StringBuilder (${(node as StringBuilderNode).string})]:\n${(node as StringBuilderNode).expressions.map((expr) => astToString(expr, level+1)).join("")}` + postfix;
        case "Block":
            return indent+`[Block]:\n${(node as BlockNode).statements.map((stmt) => astToString(stmt, level+1)).join("")}` + postfix;
        case "Condition":
            a = indent+`[If]:\n`;
            a += astToString((node as ConditionNode).condition, level+1);
            if((node as ConditionNode).body) {
                a += indent+`[Then]:\n`;
                a += astToString((node as ConditionNode).body as ASTNode, level+1);
            }
            if((node as ConditionNode).elseBody) {
                a += indent+`[Else]:\n`;
                a += astToString((node as ConditionNode).elseBody as ASTNode, level+1);
            }
            return a + postfix;
        case "Loop":
            a = indent+`[Loop]:\n`;
            if((node as LoopNode).initializer) {
                a += indent+`[Initializer]:\n`;
                a += astToString((node as LoopNode).initializer as ASTNode, level+1);
            }
            if((node as LoopNode).condition) {
                a += indent+`[Condition]:\n`;
                a += astToString((node as LoopNode).condition as ASTNode, level+1);
            }
            if((node as LoopNode).increment) {
                a += indent+`[Increment]:\n`;
                a += astToString((node as LoopNode).increment as ASTNode, level+1);
            }
            if((node as LoopNode).body) {
                a += indent+`[Body]:\n`;
                a += astToString((node as LoopNode).body as ASTNode, level+1);
            }
            return a + postfix;
        case "Declaration":
            a = indent+`[Declare]:\n`;
            a += indent+`[${(node as DeclarationNode).identifier}]\n`;
            if((node as DeclarationNode).initializer) {
                a += astToString((node as DeclarationNode).initializer as ASTNode, level+1);
            }
            return a + postfix;
        default:
            return `Unknown ASTNode type ${node.type}`;
    }
}