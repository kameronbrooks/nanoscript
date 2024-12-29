
export interface IObjectGeneratorProperty {
    name: string;
    dtype?: string;
}

export interface IObjectGenerator {
    properties: IObjectGeneratorProperty[];
}

/**
 * Generate an object from a generator and values
 * @param generator 
 * @param values 
 * @returns 
 */
export function generateObject(generator: IObjectGenerator, values: any[]): any {
    let obj: any = {};
    for (let i = 0; i < generator.properties.length; i++) {
        obj[generator.properties[i].name] = values[i];
    }
    return obj;
}