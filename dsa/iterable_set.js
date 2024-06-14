import {
    Iterable
} from "./iterable.js";

export class IterableSet extends Iterable {
    #set;

    constructor(set) {
        super();

        this.#set = set;
    }

    //O(N)
    get(key) {
        const iterator = this.iterator;
        let curr_item = iterator.next();
        let idx = 0;

        while (curr_item != null && idx < key) {
            curr_item = iterator.next();
            idx++;
        }

        return curr_item;
    }

    //O(1)
    set(value) {
        this.#set.add(value);
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