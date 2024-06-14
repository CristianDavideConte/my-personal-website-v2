import {
    UInt8IterableArrayBuilder
} from "../iterable_array/uint8_iterable_array_builder.js";

import {
    MatrixInterface
} from "./matrix_interface.js";

export class UInt8MatrixBuilder {
    build(rows, cols, initial_value = 0) {
        return new MatrixInterface(
            rows,
            cols,
            new UInt8IterableArrayBuilder().build(rows * cols, initial_value),
            this
        );
    };
}