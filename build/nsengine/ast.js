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
    let indent = `\x1b[${level + 32}m` + "--".repeat(level);
    let postfix = level == 0 ? "\x1b[0m" : "";
    const arrow = (level > 1) ? "↳" : "";
    if (!node)
        return "";
    let a, b, c, d, e;
    switch (node.type) {
        case "Number":
            return indent + `[${node.value.toString()}]\n` + postfix;
        case "UnaryOp":
            return indent + `[${node.operator}]:\n${astToString(node.operand, level + 1)}` + postfix;
        case "BinaryOp":
            return indent + `[${node.operator}]:\n${astToString(node.left, level + 1)}${astToString(node.right, level + 1)}` + postfix;
        case "Assignment":
            return indent + `[${node.operator}]:\n${astToString(node.left, level + 1)}${astToString(node.right, level + 1)}` + postfix;
        case "Identifier":
            return indent + `[${node.value}]\n` + postfix;
        case "MemberAccess":
            return indent + `[.]:\n${astToString(node.object, level + 1)}${astToString(node.member, level + 1)}` + postfix;
        case "FunctionCall":
            return indent + `[()->{}]:\n${astToString(node.left, level + 1)}` + node.arguments.map((arg) => astToString(arg, level + 1)).join("") + postfix;
        case "Indexer":
            return indent + `[[]]:\n${astToString(node.object, level + 1)}` + node.indices.map((arg) => astToString(arg, level + 1)).join("") + postfix;
        case "String":
            return indent + `["${node.value}"]\n` + postfix;
        case "StringBuilder":
            return indent + `[StringBuilder (${node.string})]:\n${node.expressions.map((expr) => astToString(expr, level + 1)).join("")}` + postfix;
        case "Block":
            return indent + `[Block]:\n${node.statements.map((stmt) => astToString(stmt, level + 1)).join("")}` + postfix;
        case "Condition":
            a = indent + `[If]:\n`;
            a += astToString(node.condition, level + 1);
            if (node.body) {
                a += indent + `[Then]:\n`;
                a += astToString(node.body, level + 1);
            }
            if (node.elseBody) {
                a += indent + `[Else]:\n`;
                a += astToString(node.elseBody, level + 1);
            }
            return a + postfix;
        case "Loop":
            a = indent + `[Loop]:\n`;
            if (node.initializer) {
                a += indent + `[Initializer]:\n`;
                a += astToString(node.initializer, level + 1);
            }
            if (node.condition) {
                a += indent + `[Condition]:\n`;
                a += astToString(node.condition, level + 1);
            }
            if (node.increment) {
                a += indent + `[Increment]:\n`;
                a += astToString(node.increment, level + 1);
            }
            if (node.body) {
                a += indent + `[Body]:\n`;
                a += astToString(node.body, level + 1);
            }
            return a + postfix;
        case "Declaration":
            a = indent + `[Declare]:\n`;
            a += indent + `[${node.identifier}]\n`;
            if (node.initializer) {
                a += astToString(node.initializer, level + 1);
            }
            return a + postfix;
        default:
            return `Unknown ASTNode type ${node.type}`;
    }
}
