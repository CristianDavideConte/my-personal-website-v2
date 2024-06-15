import {
    DisjointSetInterface
} from "../disjoint_set_interface.js";

export class ArrayDisjointSetInterface extends DisjointSetInterface {
    find(x) {
        if (this.parents.get(x) === x) return x;

        this.parents.set(x, this.find(this.parents.get(x)));

        return this.parents.get(x);
    }

    union(x1, x2) {
        const parent_1 = this.find(x1);
        const parent_2 = this.find(x2);

        if (parent_1 === parent_2) return false;

        const new_rank = this.ranks.get(parent_1) + this.ranks.get(parent_2);

        if (this.ranks.get(parent_1) > this.ranks.get(parent_2)) {
            this.parents.set(parent_2, parent_1);
            this.ranks.set(parent_1, new_rank);
        } else {
            this.parents.set(parent_1, parent_2);
            this.ranks.set(parent_2, new_rank);
        }

        return true;
    }
}