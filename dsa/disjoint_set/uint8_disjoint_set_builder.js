import {
    DisjointSetInterface 
} from "./disjoint_set_interface.js";

export class UInt8DisjointSetBuilder {
    build(size) {
        const parents = new IterableArray(new Uint8Array(size));
        const ranks = new IterableArray(new Uint8Array(size));

        for (let i = 0; i < size; i++) {
            parents.set(i, i);
            ranks.set(i, 1);
        }

        return new DisjointSetInterface(ranks, parents);
    }
}