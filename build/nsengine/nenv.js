"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nenv = void 0;
/**
 * The nano environment class
 */
class Nenv {
    constructor() {
        this.modules = {};
        this.references = {};
    }
    addModule(module) {
        if (this.modules[module.name]) {
            throw new Error(`Module ${module.name} already exists`);
        }
        this.modules[module.name] = module;
        for (let exp of module.exports) {
            // If there are 2 exports with the same name, remove the reference
            // The objects will have to be access by their full name including path
            if (this.references[exp.name]) {
                delete this.references[exp.name];
            }
            else {
                this.references[exp.name] = { module: module.name, export: exp };
            }
        }
    }
    deleteModule(name) {
        let module = this.modules[name];
        if (module) {
            for (let exp of module.exports) {
                delete this.references[exp.name];
            }
            delete this.modules[name];
        }
    }
    getObject(name) {
        let output = this.references[name];
        console.log(output);
        if (output) {
            return output.export;
        }
        if (name.includes(".")) {
            let parts = name.split(".");
            let module = this.modules[parts[0]];
            if (module) {
                return module;
            }
        }
        throw new Error(`Object ${name} is not a valid reference or module in this nenv`);
    }
}
exports.Nenv = Nenv;
