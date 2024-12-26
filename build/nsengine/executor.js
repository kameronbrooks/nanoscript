"use strict";
/**
 * Executor.ts
 *
 * This file contains the Executor class, which is responsible for executing the intermediate code generated by the parser.
 *
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSExecutor = void 0;
const prg = __importStar(require("./program"));
class ExternalFunction {
    constructor(id, signature, callback) {
        this.id = id;
        this.signature = signature;
        this.callback = callback;
    }
}
class Interface {
    constructor(functions) {
        this.functions = functions;
    }
}
class JSExecutor {
    constructor(maxStackSize = 1024) {
        this.stack = [];
        this.heap = [];
        this.ip = 0;
        this.sp = 0;
        this.fp = 0;
        this.ip = 0;
        this.sp = 0;
        this.fp = 0;
        this.ops = [
            this.op_noop.bind(this),
            this.op_term.bind(this),
            this.op_jump.bind(this),
            this.op_branch_true.bind(this),
            this.op_branch_false.bind(this),
            this.op_branch_null.bind(this),
            this.op_branch_not_null.bind(this),
            this.op_branch_equal.bind(this),
            this.op_branch_equal.bind(this),
            this.op_branch_equal.bind(this),
            this.op_branch_not_equal.bind(this),
            this.op_branch_not_equal.bind(this),
            this.op_branch_not_equal.bind(this),
            this.op_branch_greater_than.bind(this),
            this.op_branch_greater_than.bind(this),
            this.op_branch_greater_than.bind(this),
            this.op_branch_less_than.bind(this),
            this.op_branch_less_than.bind(this),
            this.op_branch_less_than.bind(this),
            this.op_branch_greater_than_or_equal.bind(this),
            this.op_branch_greater_than_or_equal.bind(this),
            this.op_branch_greater_than_or_equal.bind(this),
            this.op_branch_less_than_or_equal.bind(this),
            this.op_branch_less_than_or_equal.bind(this),
            this.op_branch_less_than_or_equal.bind(this),
            this.op_load_const_bool.bind(this),
            this.op_load_const_int.bind(this),
            this.op_load_const_float.bind(this),
            this.op_load_const_null.bind(this),
            this.op_load_const_string.bind(this),
            this.op_load_instruction_reference.bind(this),
            this.op_load_ptr.bind(this),
            this.op_load_literal_object.bind(this),
            this.op_addi.bind(this),
            this.op_subi.bind(this),
            this.op_muli.bind(this),
            this.op_divi.bind(this),
            this.op_modi.bind(this),
            this.op_powi.bind(this),
            this.op_addf.bind(this),
            this.op_subf.bind(this),
            this.op_mulf.bind(this),
            this.op_divf.bind(this),
            this.op_modf.bind(this),
            this.op_powf.bind(this),
            this.op_adds.bind(this),
            this.op_greater_than_i.bind(this),
            this.op_less_than_i.bind(this),
            this.op_greater_than_or_equal_i.bind(this),
            this.op_less_than_or_equal_i.bind(this),
            this.op_equal_i.bind(this),
            this.op_not_equal_i.bind(this),
            this.op_greater_than_f.bind(this),
            this.op_less_than_f.bind(this),
            this.op_greater_than_or_equal_f.bind(this),
            this.op_less_than_or_equal_f.bind(this),
            this.op_equal_f.bind(this),
            this.op_not_equal_f.bind(this),
            this.op_equal_b.bind(this),
            this.op_not_equal_b.bind(this),
            this.op_equal_s.bind(this),
            this.op_not_equal_s.bind(this),
            this.op_not_b.bind(this),
            this.op_neg_i.bind(this),
            this.op_neg_f.bind(this),
            this.op_increment_local_post.bind(this),
            this.op_decrement_local_post.bind(this),
            this.op_int_to_float.bind(this),
            this.op_float_to_int.bind(this),
            this.op_int_to_string.bind(this),
            this.op_float_to_string.bind(this),
            this.op_load_local.bind(this),
            this.op_load_local.bind(this),
            this.op_load_local.bind(this),
            this.op_store_local.bind(this),
            this.op_store_local.bind(this),
            this.op_store_local.bind(this),
            this.op_load_member.bind(this),
            this.op_load_member.bind(this),
            this.op_load_member.bind(this),
            this.op_store_member.bind(this),
            this.op_store_member.bind(this),
            this.op_store_member.bind(this),
            this.op_load_element.bind(this),
            this.op_load_element.bind(this),
            this.op_load_element.bind(this),
            this.op_store_element.bind(this),
            this.op_store_element.bind(this),
            this.op_store_element.bind(this),
            this.op_load_external.bind(this),
            this.op_alloc_stack.bind(this),
            this.op_pop_stack.bind(this),
            this.op_alloc_heap.bind(this),
            this.op_pop_heap.bind(this),
            this.op_call_internal.bind(this),
            this.op_call_external.bind(this),
            this.op_call_stack.bind(this),
            this.op_return.bind(this),
            this.op_return8.bind(this),
            this.op_return32.bind(this),
            this.op_return64.bind(this),
            this.op_push_return8.bind(this),
            this.op_push_return32.bind(this),
            this.op_push_return64.bind(this)
        ];
        /*
        let i = 0;
        while (i < prg.OP_CALL_EXTERNAL) {
            console.log(`${i}: ${prg.getOpName(i)} ${this.ops[i]}`);
            i++;
        }
        */
    }
    execute(program) {
        this.program = program;
        this.ip = 0;
        this.fp = 0;
        while (program.instructions[this.ip].opcode != prg.OP_TERM) {
            this.ops[program.instructions[this.ip].opcode]();
        }
        if (this.stack.length > 0) {
            return this.stack.pop();
        }
        return 0;
    }
    printStack() {
        console.log("Stack: " + this.stack);
    }
    printHeap() {
        console.log("Heap: " + this.heap);
    }
    op_noop() {
        this.ip++;
    }
    op_term() {
        this.ip++;
    }
    op_jump() {
        var _a;
        this.ip = (_a = this.program) === null || _a === void 0 ? void 0 : _a.instructions[this.ip].operand;
    }
    op_branch_false() {
        var _a;
        if (!this.stack.pop()) {
            this.ip = (_a = this.program) === null || _a === void 0 ? void 0 : _a.instructions[this.ip].operand;
        }
        else {
            this.ip++;
        }
    }
    op_branch_true() {
        var _a;
        if (this.stack.pop()) {
            this.ip = (_a = this.program) === null || _a === void 0 ? void 0 : _a.instructions[this.ip].operand;
        }
        else {
            this.ip++;
        }
    }
    op_branch_null() {
        var _a;
        if (this.stack.pop() == null) {
            this.ip = (_a = this.program) === null || _a === void 0 ? void 0 : _a.instructions[this.ip].operand;
        }
        else {
            this.ip++;
        }
    }
    op_branch_not_null() {
        var _a;
        if (this.stack.pop() != null) {
            this.ip = (_a = this.program) === null || _a === void 0 ? void 0 : _a.instructions[this.ip].operand;
        }
        else {
            this.ip++;
        }
    }
    op_branch_equal() {
        var _a;
        if (this.stack.pop() == this.stack.pop()) {
            this.ip = (_a = this.program) === null || _a === void 0 ? void 0 : _a.instructions[this.ip].operand;
        }
        else {
            this.ip++;
        }
    }
    op_branch_not_equal() {
        var _a;
        if (this.stack.pop() != this.stack.pop()) {
            this.ip = (_a = this.program) === null || _a === void 0 ? void 0 : _a.instructions[this.ip].operand;
        }
        else {
            this.ip++;
        }
    }
    op_branch_greater_than() {
        var _a;
        if (this.stack.pop() > this.stack.pop()) {
            this.ip = (_a = this.program) === null || _a === void 0 ? void 0 : _a.instructions[this.ip].operand;
        }
        else {
            this.ip++;
        }
    }
    op_branch_less_than() {
        var _a;
        if (this.stack.pop() < this.stack.pop()) {
            this.ip = (_a = this.program) === null || _a === void 0 ? void 0 : _a.instructions[this.ip].operand;
        }
        else {
            this.ip++;
        }
    }
    op_branch_greater_than_or_equal() {
        var _a;
        if (this.stack.pop() >= this.stack.pop()) {
            this.ip = (_a = this.program) === null || _a === void 0 ? void 0 : _a.instructions[this.ip].operand;
        }
        else {
            this.ip++;
        }
    }
    op_branch_less_than_or_equal() {
        var _a;
        if (this.stack.pop() <= this.stack.pop()) {
            this.ip = (_a = this.program) === null || _a === void 0 ? void 0 : _a.instructions[this.ip].operand;
        }
        else {
            this.ip++;
        }
    }
    op_load_const_bool() {
        var _a;
        this.stack.push((_a = this.program) === null || _a === void 0 ? void 0 : _a.instructions[this.ip].operand);
        this.ip++;
    }
    op_load_const_int() {
        var _a;
        this.stack.push((_a = this.program) === null || _a === void 0 ? void 0 : _a.instructions[this.ip].operand);
        this.ip++;
    }
    op_load_const_float() {
        var _a;
        this.stack.push((_a = this.program) === null || _a === void 0 ? void 0 : _a.instructions[this.ip].operand);
        this.ip++;
    }
    op_load_const_null() {
        this.stack.push(null);
        this.ip++;
    }
    op_load_const_string() {
        var _a;
        this.stack.push((_a = this.program) === null || _a === void 0 ? void 0 : _a.instructions[this.ip].operand);
        this.ip++;
    }
    op_load_instruction_reference() {
        var _a;
        this.stack.push((_a = this.program) === null || _a === void 0 ? void 0 : _a.instructions[this.ip].operand);
        this.ip++;
    }
    op_load_ptr() {
        var _a;
        this.stack.push((_a = this.program) === null || _a === void 0 ? void 0 : _a.instructions[this.ip].operand);
        this.ip++;
    }
    op_load_literal_object() {
        var _a;
        this.stack.push((_a = this.program) === null || _a === void 0 ? void 0 : _a.instructions[this.ip].operand);
        this.ip++;
    }
    op_addi() {
        let b = this.stack.pop();
        let a = this.stack.pop();
        this.stack.push(a + b);
        this.ip++;
    }
    op_subi() {
        let b = this.stack.pop();
        let a = this.stack.pop();
        this.stack.push(a - b);
        this.ip++;
    }
    op_muli() {
        let b = this.stack.pop();
        let a = this.stack.pop();
        this.stack.push(a * b);
        this.ip++;
    }
    op_divi() {
        let b = this.stack.pop();
        let a = this.stack.pop();
        this.stack.push(a / b);
        this.ip++;
    }
    op_modi() {
        let b = this.stack.pop();
        let a = this.stack.pop();
        this.stack.push(a % b);
        this.ip++;
    }
    op_powi() {
        let b = this.stack.pop();
        let a = this.stack.pop();
        this.stack.push(a ** b);
        this.ip++;
    }
    op_addf() {
        let b = this.stack.pop();
        let a = this.stack.pop();
        this.stack.push(a + b);
        this.ip++;
    }
    op_subf() {
        let b = this.stack.pop();
        let a = this.stack.pop();
        this.stack.push(a - b);
        this.ip++;
    }
    op_mulf() {
        let b = this.stack.pop();
        let a = this.stack.pop();
        this.stack.push(a * b);
        this.ip++;
    }
    op_divf() {
        let b = this.stack.pop();
        let a = this.stack.pop();
        this.stack.push(a / b);
        this.ip++;
    }
    op_modf() {
        let b = this.stack.pop();
        let a = this.stack.pop();
        this.stack.push(a % b);
        this.ip++;
    }
    op_powf() {
        let b = this.stack.pop();
        let a = this.stack.pop();
        this.stack.push(a ** b);
        this.ip++;
    }
    op_adds() {
        let b = this.stack.pop();
        let a = this.stack.pop();
        this.stack.push(a + b);
        this.ip++;
    }
    op_greater_than_i() {
        let b = this.stack.pop();
        let a = this.stack.pop();
        this.stack.push(a > b);
        this.ip++;
    }
    op_less_than_i() {
        let b = this.stack.pop();
        let a = this.stack.pop();
        this.stack.push(a < b);
        this.ip++;
    }
    op_greater_than_or_equal_i() {
        let b = this.stack.pop();
        let a = this.stack.pop();
        this.stack.push(a >= b);
        this.ip++;
    }
    op_less_than_or_equal_i() {
        let b = this.stack.pop();
        let a = this.stack.pop();
        this.stack.push(a <= b);
        this.ip++;
    }
    op_equal_i() {
        let b = this.stack.pop();
        let a = this.stack.pop();
        this.stack.push(a == b);
        this.ip++;
    }
    op_not_equal_i() {
        let b = this.stack.pop();
        let a = this.stack.pop();
        this.stack.push(a != b);
        this.ip++;
    }
    op_greater_than_f() {
        let b = this.stack.pop();
        let a = this.stack.pop();
        this.stack.push(a > b);
        this.ip++;
    }
    op_less_than_f() {
        let b = this.stack.pop();
        let a = this.stack.pop();
        this.stack.push(a < b);
        this.ip++;
    }
    op_greater_than_or_equal_f() {
        let b = this.stack.pop();
        let a = this.stack.pop();
        this.stack.push(a >= b);
        this.ip++;
    }
    op_less_than_or_equal_f() {
        let b = this.stack.pop();
        let a = this.stack.pop();
        this.stack.push(a <= b);
        this.ip++;
    }
    op_equal_f() {
        let b = this.stack.pop();
        let a = this.stack.pop();
        this.stack.push(a == b);
        this.ip++;
    }
    op_not_equal_f() {
        let b = this.stack.pop();
        let a = this.stack.pop();
        this.stack.push(a != b);
        this.ip++;
    }
    op_equal_b() {
        let b = this.stack.pop();
        let a = this.stack.pop();
        this.stack.push(a == b);
        this.ip++;
    }
    op_not_equal_b() {
        let b = this.stack.pop();
        let a = this.stack.pop();
        this.stack.push(a != b);
        this.ip++;
    }
    op_equal_s() {
        let b = this.stack.pop();
        let a = this.stack.pop();
        this.stack.push(a == b);
        this.ip++;
    }
    op_not_equal_s() {
        let b = this.stack.pop();
        let a = this.stack.pop();
        this.stack.push(a != b);
        this.ip++;
    }
    op_not_b() {
        let a = this.stack.pop();
        this.stack.push(!a);
        this.ip++;
    }
    op_neg_i() {
        let a = this.stack.pop();
        this.stack.push(-a);
        this.ip++;
    }
    op_neg_f() {
        let a = this.stack.pop();
        this.stack.push(-a);
        this.ip++;
    }
    op_increment_local_post() {
        var _a;
        this.stack[this.fp + ((_a = this.program) === null || _a === void 0 ? void 0 : _a.instructions[this.ip].operand)]++;
        this.ip++;
    }
    op_decrement_local_post() {
        var _a;
        this.stack[this.fp + ((_a = this.program) === null || _a === void 0 ? void 0 : _a.instructions[this.ip].operand)]--;
        this.ip++;
    }
    op_int_to_float() {
        let a = this.stack.pop();
        this.stack.push(a);
        this.ip++;
    }
    op_float_to_int() {
        let a = this.stack.pop();
        this.stack.push(Math.floor(a));
        this.ip++;
    }
    op_int_to_string() {
        let a = this.stack.pop();
        this.stack.push(a.toString());
        this.ip++;
    }
    op_float_to_string() {
        let a = this.stack.pop();
        this.stack.push(a.toString());
        this.ip++;
    }
    op_load_local() {
        var _a;
        this.stack.push(this.stack[this.fp + ((_a = this.program) === null || _a === void 0 ? void 0 : _a.instructions[this.ip].operand)]);
        this.ip++;
    }
    op_store_local() {
        var _a;
        this.stack[this.fp + ((_a = this.program) === null || _a === void 0 ? void 0 : _a.instructions[this.ip].operand)] = this.stack.pop();
        this.ip++;
    }
    op_load_external() {
        var _a;
        this.stack.push((_a = this.program) === null || _a === void 0 ? void 0 : _a.instructions[this.ip].operand);
        this.ip++;
    }
    op_alloc_stack() {
        var _a;
        for (let i = 0; i < ((_a = this.program) === null || _a === void 0 ? void 0 : _a.instructions[this.ip].operand); i++) {
            this.stack.push(null);
            this.sp++;
        }
        this.ip++;
    }
    op_pop_stack() {
        var _a;
        for (let i = 0; i < ((_a = this.program) === null || _a === void 0 ? void 0 : _a.instructions[this.ip].operand); i++) {
            this.stack.pop();
            this.sp--;
        }
        this.ip++;
    }
    op_alloc_heap() {
        var _a;
        for (let i = 0; i < ((_a = this.program) === null || _a === void 0 ? void 0 : _a.instructions[this.ip].operand); i++) {
            this.heap.push(null);
        }
        this.ip++;
    }
    op_load_member() {
        var _a;
        let a = this.stack.pop();
        this.stack.push(a[(_a = this.program) === null || _a === void 0 ? void 0 : _a.instructions[this.ip].operand]);
        this.ip++;
    }
    op_store_member() {
        var _a;
        let a = this.stack.pop();
        a[(_a = this.program) === null || _a === void 0 ? void 0 : _a.instructions[this.ip].operand] = this.stack.pop();
        this.ip++;
    }
    op_load_element() {
        let a = this.stack.pop();
        let b = this.stack.pop();
        this.stack.push(a[b]);
        this.ip++;
    }
    op_store_element() {
        let a = this.stack.pop();
        let b = this.stack.pop();
        let c = this.stack.pop();
        a[b] = c;
        this.ip++;
    }
    op_pop_heap() {
        var _a;
        for (let i = 0; i < ((_a = this.program) === null || _a === void 0 ? void 0 : _a.instructions[this.ip].operand); i++) {
            this.heap.pop();
        }
        this.ip++;
    }
    op_call_internal() {
        var _a;
        // push a stack frame
        this.stack.push(this.fp);
        // push the return address
        this.stack.push(this.ip + 1);
        // set the new frame pointer
        this.fp = this.stack.length;
        // set the new instruction pointer
        this.ip = (_a = this.program) === null || _a === void 0 ? void 0 : _a.instructions[this.ip].operand;
    }
    op_return() {
        this.ip = this.stack.pop();
        this.fp = this.stack.pop();
    }
    op_return8() {
        this.ret = this.stack.pop();
        while (this.stack.length > this.fp) {
            this.stack.pop();
        }
        // set the new instruction pointer to the return address
        this.ip = this.stack.pop();
        // restore the frame pointer
        this.fp = this.stack.pop();
    }
    op_return32() {
        this.ret = this.stack.pop();
        while (this.stack.length > this.fp) {
            this.stack.pop();
        }
        // set the new instruction pointer to the return address
        this.ip = this.stack.pop();
        // restore the frame pointer
        this.fp = this.stack.pop();
    }
    op_return64() {
        this.ret = this.stack.pop();
        while (this.stack.length > this.fp) {
            this.stack.pop();
        }
        // set the new instruction pointer to the return address
        this.ip = this.stack.pop();
        // restore the frame pointer
        this.fp = this.stack.pop();
    }
    op_call_external() {
        var _a, _b;
        let a = this.stack.pop();
        if (((_a = this.program) === null || _a === void 0 ? void 0 : _a.instructions[this.ip].operand) < 1) {
            this.ret = a();
        }
        else {
            let b = [];
            for (let i = 0; i < ((_b = this.program) === null || _b === void 0 ? void 0 : _b.instructions[this.ip].operand); i++) {
                b.push(this.stack.pop());
            }
            this.ret = a(...b.reverse());
        }
        this.ip++;
    }
    op_call_stack() {
        // push a stack frame
        this.stack.push(this.fp);
        // push the return address
        this.stack.push(this.ip + 1);
        // set the new frame pointer
        this.fp = this.stack.length;
        // set the new instruction pointer
        this.ip = this.stack.pop();
    }
    op_push_return8() {
        this.stack.push(this.ret);
        this.ip++;
    }
    op_push_return32() {
        this.stack.push(this.ret);
        this.ip++;
    }
    op_push_return64() {
        this.stack.push(this.ret);
        this.ip++;
    }
}
exports.JSExecutor = JSExecutor;
