import {
    DisjointSetInterface
} from "../disjoint_set_interface.js";

export class MatrixDisjointSetInterface extends DisjointSetInterface {
    find(x, y) {
        const curr_idx = this.parents.from_ij_to_idx(x, y);
        let parent_idx = this.parents.get(x, y);

        if (parent_idx === curr_idx) return parent_idx;

        const [new_x, new_y] = this.parents.from_idx_to_ij(parent_idx);
        parent_idx = find(new_x, new_y);
        this.parents.set_nth(curr_idx, parent_idx);

        return parent_idx;
    }

    union(x1, y1, x2, y2) {
        const parent_idx_1 = find(x1, y1);
        const parent_idx_2 = find(x2, y2);

        if (parent_idx_1 == parent_idx_2) return false;

        const new_rank = this.ranks.get(parent_idx_1) + this.ranks.get(parent_idx_2);

        if (this.ranks.get(parent_idx_1) > this.ranks.get(parent_idx_2)) {
            this.parents.set_nth(parent_idx_2, parent_idx_1);
            this.ranks.set(parent_idx_1, new_rank);
        } else {
            this.parents.set_nth(parent_idx_1, parent_idx_2);
            this.ranks.set(parent_idx_2, new_rank);
        }

        return true;
    }
}