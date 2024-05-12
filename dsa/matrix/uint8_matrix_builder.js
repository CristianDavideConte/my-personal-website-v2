import {
    MatrixInterface
} from "./matrix_interface.js";

export class UInt8MatrixBuilder {
    build(rows, cols) { 
        return new MatrixInterface(rows, cols, new Uint8Array(rows * cols));
    };
}