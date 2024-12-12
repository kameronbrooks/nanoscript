"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OP_LOAD_CONST_I64 = exports.OP_LOAD_CONST_I32 = exports.OP_LOAD_CONST_I8 = exports.OP_BRANCH_FALSE = exports.OP_BRANCH_TRUE = exports.OP_JUMP = exports.OP_TERM = exports.OP_NOOP = void 0;
exports.OP_NOOP = 0x00;
exports.OP_TERM = 0x01;
exports.OP_JUMP = 0x02;
exports.OP_BRANCH_TRUE = 0x03;
exports.OP_BRANCH_FALSE = 0x04;
// ============= STACK OPERATIONS =============
exports.OP_LOAD_CONST_I8 = 0x05;
exports.OP_LOAD_CONST_I32 = 0x06;
exports.OP_LOAD_CONST_I64 = 0x07;
