"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNumberNode = createNumberNode;
exports.createUnaryOpNode = createUnaryOpNode;
exports.createBinaryOpNode = createBinaryOpNode;
function createNumberNode(value) {
    return { type: "Number", value };
}
function createUnaryOpNode(operator, operand) {
    return { type: "UnaryOp", operator, operand };
}
function createBinaryOpNode(operator, left, right) {
    return { type: "BinaryOp", operator: operator, left: left, right: right };
}
