import {
    BuilderInterface
} from "./builder_interface.js";

export class UInt8Matrix extends BuilderInterface {
    constructor(rows, cols) { 
        super(rows, cols);
        this._matrix = new Uint8Array(this._rows * this._cols);
    };
}