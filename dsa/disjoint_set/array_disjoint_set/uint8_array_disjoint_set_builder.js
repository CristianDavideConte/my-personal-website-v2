import {
    UInt8IterableArrayBuilder
} from "../../iterable_array/uint8_iterable_array_builder.js";

import {
    ArrayDisjointSetInterface 
} from "./array_disjoint_set_interface.js";

export class UInt8ArrayDisjointSetBuilder {
    build(size) {
        const builder = new UInt8IterableArrayBuilder();
        const parents = builder.build(size);
        const ranks = builder.build(size, 1);

        for (let i = 0; i < size; i++) {
            parents.set(i, i);
            ranks.set(i, 1);
        }

        return new ArrayDisjointSetInterface(ranks, parents);
    }
}