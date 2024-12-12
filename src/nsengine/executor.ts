
/**
 * Executor.ts
 * 
 * This file contains the Executor class, which is responsible for executing the intermediate code generated by the parser.
 * 
 */


class ExternalFunction {
    id: string;
    signature: string;
    callback: Function;

    constructor(id: string, signature: string, callback: Function) {
        this.id = id;
        this.signature = signature;
        this.callback = callback;
    }

    
}

class Interface {
    functions: ExternalFunction[];

    constructor(functions: ExternalFunction[]) {
        this.functions = functions;
    }
}

class Executor {
    stack: ArrayBuffer;
    
    constructor() {
        this.stack = new ArrayBuffer(1024);
    }
}