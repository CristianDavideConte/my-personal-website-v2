import {
    Iterable
} from "./iterable.js";

export class IterableSet extends Iterable {
    #set;

    constructor(set) {
        super();

        this.#set = set;
    }

    //O(1)
    size() {
        return this.#set.size;
    }

    get iterator() {
        const iterator = this.#set[Symbol.iterator]();

        return {
            next: () => {
                const next = iterator.next();
                return next.done ? null : next.value;
            }
        };
    }
}