
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
export interface IdentifierNode extends ASTNode {
    type: "Identifier";
    value: string;
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
    body: ASTNode|null;
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