import {
    Iterable
} from "./iterable.js";

export class IterableArray extends Iterable {
    _arr;

    constructor(arr) {
        super();
        
        this._arr = arr;
    }

    get iterator() {
        const iterator = this._arr[Symbol.iterator]();

        return {
            next: () => {
                const next = iterator.next();
                return next.done ? null : next.value;
            }
        };
    }
}