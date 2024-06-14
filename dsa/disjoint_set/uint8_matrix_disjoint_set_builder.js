import {
    UInt8IterableArrayBuilder
} from "../../dsa/iterable_array/uint8_iterable_array_builder.js";

import {
    UInt8MatrixBuilder
} from "../../dsa/matrix/uint8_matrix_builder.js";

import {
    DisjointSetInterface
} from "./disjoint_set_interface.js";

export class UInt8MatrixDisjointSetBuilder {
    build(rows, cols) {
        const parents = new UInt8MatrixBuilder().build(rows, cols);
        const ranks = new UInt8IterableArrayBuilder().build(rows * cols, 1);

        parents.forEach((el, idx) => parents.set_nth(idx, idx));

        return new DisjointSetInterface(ranks, parents);
    }
}