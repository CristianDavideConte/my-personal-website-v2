import {
    Iterable
} from "./iterable.js";

export class IterableArray extends Iterable {
    #arr;

    constructor(arr) {
        super();
        
        this.#arr = arr;
    }
    
    size() {
        return this.#arr.length;
    }

    get iterator() {
        const iterator = this.#arr[Symbol.iterator]();

        return {
            next: () => {
                const next = iterator.next();
                return next.done ? null : next.value;
            }
        };
    }
}