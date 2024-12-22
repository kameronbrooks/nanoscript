import { builtin_module } from "../nenvmodules/builtin";
import { Nenv, NenvExport, NenvModule } from "./nenv";
import { Tokenizer } from "./tokenizer";
import { Interpreter } from "./interpreter";
import { Compiler } from "./compiler";
import { Program } from "./program";
import { Executor } from "./executor";

/**
 * This is the nano script engine
 * This class can compile and run nano scripts
 */
export class NSEngine {
    _nenv: Nenv;
    _excutor: Executor;
    
    constructor() {
        this._nenv = new Nenv();
        this._nenv.addModule(builtin_module);
        this._excutor = new Executor(1024);
    }

    /**
     * Add modules to the nano environment
     * The builtin module is added by default
     * @param modules 
     */
    addModules(modules: NenvModule[]) {
        for (let module of modules) {
            this._nenv.addModule(module);
        }
    }

    /**
     * Compile a nano script into a program
     * @param code 
     * @returns 
     */
    compile(code: string) {
        let tokenizer = new Tokenizer(code);
        let tokens = tokenizer.tokenize();
        let interpreter = new Interpreter(tokens);
        let ast = interpreter.parse();
        let compiler = new Compiler(this._nenv);
        let program = compiler.compile([ast] as any);
        return program;
    }
    /**
     * Run a compiled program
     * @param program 
     * @returns 
     */
    run(program: Program) {
        return this._excutor.execute(program);
    }
    /**
     * Compile and run a nano script in one step
     * @param code 
     * @returns 
     */
    compileAndRun(code: string) {
        let program = this.compile(code);
        return this.run(program);
    }

}