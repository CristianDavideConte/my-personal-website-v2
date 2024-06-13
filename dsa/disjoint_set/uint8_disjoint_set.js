import {
    DisjointSet 
} from "./disjoint_set_interface.js";

export class Uint8DisjointSet extends DisjointSet {
    constructor(size) {
        this.parents = new Uint8Array(size);
        this.ranks = new Uint8Array(size);

        for (let i = 0; i < size; i++) this.ranks[i] = i;
    }
}