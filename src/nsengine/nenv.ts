

export interface NenvExport {
    name: string;
    description?: string;
    object: any;
    type: "function" | "object" | "class" | "constant";
    datatype?: string;
}

export interface NenvModule {
    name: string;
    version?: string;
    exports: NenvExport[];
}

export interface NenvReference {
    module: string;
    export: NenvExport;
}


/**
 * The nano environment class
 */
export class Nenv {
    private modules: { [key: string]: NenvModule };
    private references: { [key: string]: NenvReference };
    constructor() {
        this.modules = {};
        this.references = {};

    }

    addModule(module: NenvModule) {
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

    deleteModule(name: string) {
        let module = this.modules[name];
        if (module) {
            for (let exp of module.exports) {
                delete this.references[exp.name];
            }
            delete this.modules[name];
        }
    }

    getObject(name: string): any {
        let output = this.references[name];
        if (output) {
            return output.export.object;
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