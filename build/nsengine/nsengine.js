"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NSEngine = void 0;
const builtin_1 = require("../nenvmodules/builtin");
const nenv_1 = require("./nenv");
const tokenizer_1 = require("./tokenizer");
const interpreter_1 = require("./interpreter");
const compiler_1 = require("./compiler");
const executor_1 = require("./executor");
/**
 * This is the nano script engine
 * This class can compile and run nano scripts
 */
class NSEngine {
    constructor() {
        this.version = "0.0.1";
        this._nenv = new nenv_1.Nenv();
        this._nenv.addModule(builtin_1.builtin_module);
        this._excutor = new executor_1.JSExecutor(1024);
    }
    /**
     * Add modules to the nano environment
     * The builtin module is added by default
     * @param modules
     */
    addModules(modules) {
        for (let module of modules) {
            this._nenv.addModule(module);
        }
    }
    /**
     * Compile a nano script into a program
     * @param code
     * @returns
     */
    compile(code) {
        let tokenizer = new tokenizer_1.Tokenizer(code);
        let tokens = tokenizer.tokenize();
        let interpreter = new interpreter_1.Interpreter(tokens);
        let ast = interpreter.parse();
        let compiler = new compiler_1.Compiler(this._nenv);
        let program = compiler.compile([ast]);
        return program;
    }
    /**
     * Run a compiled program
     * @param program
     * @returns
     */
    run(program) {
        return this._excutor.execute(program);
    }
    /**
     * Compile and run a nano script in one step
     * @param code
     * @returns
     */
    compileAndRun(code) {
        let program = this.compile(code);
        return this.run(program);
    }
}
exports.NSEngine = NSEngine;
