
export interface ASTNode {
    type: string;
}

export interface NumberNode extends ASTNode {
    type: "Number";
    value: number;
}
export interface StringNode extends ASTNode {
    type: "String";
    value: string;
}
export interface BooleanNode extends ASTNode {
    type: "Boolean";
    value: boolean;
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
    body: ASTNode[];
}
export interface ConditionNode extends ASTNode {
    type: "Condition";
    condition: ASTNode;
    body?: ASTNode;
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
    const indent = "--".repeat(level);
    const arrow = (level>1) ? "↳" : "";
    if(!node) return "";
    switch(node.type) {
        case "Number":
            return indent+`[${(node as NumberNode).value.toString()}]\n`;
        case "UnaryOp":
            return indent+`[${(node as UnaryOpNode).operator}]:\n${astToString((node as UnaryOpNode).operand, level+1)}`;
        case "BinaryOp":
            return indent+`[${(node as BinaryOpNode).operator}]:\n${astToString((node as BinaryOpNode).left, level+1)}${astToString((node as BinaryOpNode).right, level+1)}`;
        case "Assignment":
            return indent+`[${(node as AssignmentNode).operator}]:\n${astToString((node as AssignmentNode).left, level+1)}${astToString((node as AssignmentNode).right, level+1)}`;
        case "Identifier":
            return indent+`[${(node as IdentifierNode).value}]\n`;
        case "MemberAccess":
            return indent+`[.]:\n${astToString((node as MemberAccessNode).object, level+1)}${astToString((node as MemberAccessNode).member, level+1)}`;
        default:
            return "Unknown ASTNode";
    }
}