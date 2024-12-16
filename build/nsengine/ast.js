"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNumberNode = createNumberNode;
exports.createUnaryOpNode = createUnaryOpNode;
exports.createBinaryOpNode = createBinaryOpNode;
exports.astToString = astToString;
function createNumberNode(value) {
    return { type: "Number", value };
}
function createUnaryOpNode(operator, operand) {
    return { type: "UnaryOp", operator, operand };
}
function createBinaryOpNode(operator, left, right) {
    return { type: "BinaryOp", operator: operator, left: left, right: right };
}
function astToString(node, level = 0) {
    const indent = "--".repeat(level);
    const arrow = (level > 1) ? "↳" : "";
    if (!node)
        return "";
    switch (node.type) {
        case "Number":
            return indent + `[${node.value.toString()}]\n`;
        case "UnaryOp":
            return indent + `[${node.operator}]:\n${astToString(node.operand, level + 1)}`;
        case "BinaryOp":
            return indent + `[${node.operator}]:\n${astToString(node.left, level + 1)}${astToString(node.right, level + 1)}`;
        case "Assignment":
            return indent + `[${node.operator}]:\n${astToString(node.left, level + 1)}${astToString(node.right, level + 1)}`;
        case "Identifier":
            return indent + `[${node.value}]\n`;
        case "MemberAccess":
            return indent + `[.]:\n${astToString(node.object, level + 1)}${astToString(node.member, level + 1)}`;
        case "FunctionCall":
            return indent + `[()->{}]:\n${astToString(node.left, level + 1)}` + node.arguments.map((arg) => astToString(arg, level + 1)).join("");
        default:
            return "Unknown ASTNode";
    }
}
