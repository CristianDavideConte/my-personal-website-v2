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

    find(x) {
        if (this.#parents.get(x) === x) return x;
        
        this.#parents.set(x, find(this.#parents.get(x))); 

        return this.#parents.get(x);
    }

    union(x1, x2) {
        const parent_1 = find(x1);
        const parent_2 = find(x2);

        if (parent_1 == parent_2) return false;

        const new_rank = this.#ranks.get(parent_1) + this.#ranks.get(parent_2);

        if (this.#ranks.get(parent_1) > this.#ranks.get(parent_2)) {
            this.#parents.set(parent_2, parent_1);
            this.#ranks.set(parent_1, new_rank);
        } else {
            this.#parents.set(parent_1, parent_2);
            this.#ranks.set(parent_2, new_rank);
        }

        return true;
    }

    size() {
        return this.#ranks.size();
    }

    to_string() {
        return this.ranks.to_string() + "\n\n" + this.parents.to_string();
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
}