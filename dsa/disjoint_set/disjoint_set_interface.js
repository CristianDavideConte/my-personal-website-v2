import {
    Iterable
} from "../iterable.js";

export class DisjointSet extends Iterable {
    #ranks;
    #parents;

    find(x) {
        if (this.parents[x] === x) return x;
        return this.parents[x] = find(this.parents[x]);
    }

    union(x1, x2) {
        const parent_1 = find(x1);
        const parent_2 = find(x2);

        if (parent_1 == parent_2) return false;

        if (this.ranks[parent_1] > this.ranks[parent_2]) {
            this.parents[parent_2] = parent_1;
            this.ranks[parent_1] += this.ranks[parent_2];
        } else {
            this.parents[parent_1] = parent_2;
            this.ranks[parent_2] += this.ranks[parent_1];
        }

        return true;
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
}