import {
    Iterable
} from "./iterable.js";

export class Sortable extends Iterable { // Abstract class
    #sorting_strategy;

    constructor(sorting_strategy) {
        super();

        this.#sorting_strategy = sorting_strategy;
    }

    get sorting_strategy() {
        return this.#sorting_strategy;
    }

    set sorting_strategy(sorting_strategy) {
        this.#sorting_strategy = sorting_strategy;
    }

    get() { throw new Error("Not implemented"); };
    set() { throw new Error("Not implemented"); };
    
    swap() { throw new Error("Not implemented"); };
    shuffle() { throw new Error("Not implemented"); };
    sort() { throw new Error("Not implemented"); };
}