import { NenvModule, NenvExport } from "../nsengine/nenv";

export const builtin_module = {
    name: "math",
    exports: [
        { name: "Math", type: "object", object: Math },
        { name: "console", type: "object", object: console}
    ] as NenvExport[]
} as NenvModule;