
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