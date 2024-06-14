import {
    Iterable
} from "../iterable.js";

export class DisjointSetInterface extends Iterable {
    #ranks; // must implement Sortable
    #parents; // must implement Sortable

    constructor(ranks, parents) {
        super(); 
        
        this.#ranks = ranks;
        this.#parents = parents;
    }

    size() {
        return this.#ranks.size();
    }

    to_string() {
        return this.parents.to_string();
    }

    get parents() {
        return this.#parents;
    }

    get ranks() {
        return this.#ranks;
    }

    set parents(parents) {
        this.#parents = parents;
    }

    set ranks(ranks) {
        this.#ranks = ranks;
    }

    get iterator() {
        const ranks_iterator = this.#ranks.iterator;
        const parents_iterator = this.#parents.iterator;

        let curr_rank = ranks_iterator.next(); 
        let curr_parent = parents_iterator.next();

        return {
            next: () => {
                if (curr_parent == null) return null;
                
                const next = {
                    parent: curr_parent,
                    rank: curr_rank
                };

                curr_parent = parents_iterator.next();
                curr_rank = ranks_iterator.next();

                return next;
            }
        };
    }

    find() { throw new Error("Not implemented"); }
    union() { throw new Error("Not implemented"); }
}