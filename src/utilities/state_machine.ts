

/**
 * A pattern target is a class that holds the collection of items that the state machine will iterate over.
 * It also holds the iterator that will be used to traverse the collection.
 * 
 * @class PatternTarget
 * @template T
 * @property {T[]} collection - The collection of items that the state machine will iterate over.
 * @property {number} iterator - The iterator that will be used to traverse the collection.
 * 
 * @example
 * const target = new PatternTarget([1, 2, 3]);
 */
export class PatternTarget {
    collection: any[];
    iterator: number;

    constructor(collection: any[]) {
        this.collection = collection;
        this.iterator = 0;
    }

    peek() : any {
        if (this.isAtEnd()) {
            return null;
        }
        return this.collection[this.iterator];
    }

    increment() {
        this.iterator++;
    }

    isAtEnd() : boolean {
        return this.iterator >= this.collection.length;
    }

}


/**
 * Creates a node that will check if the current item in the collection meets the condition.
 * If the condition is met, the iterator will be incremented and the next node will be called.
 * @param condition 
 * @param next 
 * @returns 
 */
function pNode(condition: (x:PatternTarget)=>boolean, next?: (x:PatternTarget)=>boolean): (x:PatternTarget)=>boolean {
    return (x:PatternTarget) => {
        // If we reach the end of the collection, return true
        if(x.isAtEnd()) {
            return true;
        }
        // If the condition is met, increment the iterator and call the next node
        if (condition(x)) {
            if (next) {
                x.increment();
                return next(x);
            } else {
                // If there is no next node, return true
                return true;
            }
        }
        return false;
    }
}


export interface PatternElement {
    match: number|string;
    minCount?: number;
    maxCount?: number;
    count?: number;
    flags?: string;
}

export interface Pattern {
    elements: PatternElement[];
}

export function compile(pattern: Pattern) : (x:PatternTarget)=>boolean {
    let node = undefined;

    // traverse the pattern backwards
    for (let i = pattern.elements.length - 1; i >= 0; i--) {
        const element = pattern.elements[i];
        
        const condition = (x:PatternTarget) => {
            return x.peek() === element;
        }
        node = pNode(condition, node);
    }

    if (!node) {
        return (x:PatternTarget) => {
            return x.isAtEnd();
        }
    }

    return node;
}
