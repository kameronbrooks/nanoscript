/**
 * @file dtype.ts
 * @description Contains the base class for all data types
 */
import { Compiler } from "../compiler";

export interface DTypeMember {
    id: string;
    name: string;
    dtype: string;
    description: string;
    required: boolean;
    default: any;
    memberType: "property" | "method";
}

/**
 * The result of a type operation
 * Contains the resulting data type name and whether the result can be an lvalue
 * @param datatype The resulting data type name
 * @param lvalue Whether the result can be an lvalue
 */
export interface TypeOperationResult {
    /**
     * The resulting data type name
     */
    datatype: string;
    /**
     * Whether the result can be an lvalue
     */
    lvalue: boolean;
}

/**
 * Performs a series of instructions during the compilation process
 * Then returns the resulting data type name
 * @param compiler The compiler instance
 */
export type TypeOperationFunction = (compiler: Compiler, params?: any) => TypeOperationResult;



export interface IDType {
    id: string;
    name: string;
    type: string;
    description: string;
    members: DTypeMember[];
    operations: {[key:string]: TypeOperationFunction};
    defaultType: DType | null;
    parent: DType | null;
    aliases?: string[];

    canBeIndexed: boolean;                 // Can be indexed with square brackets
    canBeIterated: boolean;                // Can be used in a for loop
    canBeCalled: boolean;                  // Can be called as a function
}


/**
 * The base class for all data types
 */
export abstract class DType implements IDType {
    id: string;
    name: string;
    type: string;
    description: string;
    members: DTypeMember[];
    operations: {[key:string]: TypeOperationFunction};
    defaultType: DType | null = null;
    parent: DType | null = null;
    aliases?: string[] | undefined;
    canBeIndexed: boolean;
    canBeIterated: boolean;
    canBeCalled: boolean;

    constructor(
        id: string,
        aliases: string[] | undefined,
        name: string, 
        type: string, 
        description: string, 
        members: DTypeMember[],  
        parent: DType | null,
        defaultType: DType | null,
        operations: {[key:string]: TypeOperationFunction},

    ) {
        this.id = id;
        this.name = name;
        this.aliases = aliases;
        this.type = type;
        this.description = description;
        this.members = members;
        this.operations = operations;
        this.defaultType = defaultType;
        this.parent = parent;
        this.canBeIndexed = false;
        this.canBeIterated = false;
        this.canBeCalled = false;
    }

    getMember(id: string): DTypeMember | undefined {
        return this.members.find((m) => m.id === id);
    }

    getOperation(id: string): TypeOperationFunction | undefined {
        return this.operations[id];
    }
}