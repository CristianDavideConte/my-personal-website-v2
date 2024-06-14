import {
    MatrixInterface
} from "./matrix_interface.js";

export class UInt8MatrixBuilder {
    build(rows, cols, initial_value = 0) {
        return new MatrixInterface(
            rows,
            cols,
            new Uint8Array(new Array(rows * cols).fill(initial_value)),
            this
        );
    };
}