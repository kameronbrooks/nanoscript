import { NenvModule, NenvExport } from "../nsengine/nenv";

/**
 * The range function returns an array of numbers from start to end with an increment
 * Similar to python's range function
 * @param end 
 * @param start 
 * @param increment 
 * @returns 
 */
const range = (end:number, start:number=0, increment:number=1) => {
    let arr =  new Array((end - start) / increment);
    let j = 0;
    for(let i = start; i < end; i += increment) {
        arr[j++] = i;
    }
    return arr;
};




export const builtin_module = {
    name: "math",
    exports: [
        { name: "Math", type: "object", object: Math },
        { name: "console", type: "object", object: console},
        { name: "range", type: "function", object: range }
    ] as NenvExport[]
} as NenvModule;