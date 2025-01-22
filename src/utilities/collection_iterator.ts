

export interface ICollectionIterator {
    hasNext(): boolean;
    next(): any;
}


export class Generator implements ICollectionIterator {
    private generate: (state:any) => any;
    private result: any;
    private isDone = false;
    constructor(generate: (state:any) => any) {
        this.generate = generate;
        this.isDone = false;
        this.result = null;
    }

    next() : any {
        if (this.isDone) {
            return null;
        }
        this.result = this.generate(this.result);
        return this.result;
    }

    hasNext() : boolean {
        return !this.isDone;
    }

}



export class CollectionIterator implements ICollectionIterator {
    private collection;
    private index = 0;
    constructor(collection: any[]) {
        this.collection = collection;
        this.index = 0;
    }

    hasNext() {
        return this.index < this.collection.length;
    }

    next() {
        return this.collection[this.index++];
    }

}