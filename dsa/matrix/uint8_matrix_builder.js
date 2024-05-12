import {
    MatrixInterface
} from "./matrix_interface.js";

export class UInt8MatrixBuilder extends MatrixInterface {
    constructor(rows, cols) { 
        super(rows, cols);
        this._matrix = new Uint8Array(this._rows * this._cols);
    };
}