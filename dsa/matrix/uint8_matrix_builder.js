import {
    MatrixInterface
} from "./matrix_interface.js";

export class UInt8MatrixBuilder {
    build(rows, cols, initial_value = 0) { 
        const matrix = new MatrixInterface(rows, cols, new Uint8Array(rows * cols));
        
        if (initial_value !== 0) {
            matrix.forEach((curr_item, idx) => {
                matrix.set_nth(idx, initial_value);
            })
        }

        return matrix;
    };
}