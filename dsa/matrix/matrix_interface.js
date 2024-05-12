import {
    Iterable
} from "../iterable.js";

export class MatrixInterface extends Iterable {
    _rows;
    _cols;
    _matrix;

    constructor(rows, cols) { 
        super();
        
        this._rows = rows;
        this._cols = cols;
    };
    
    get(i, j) {
        this.check_bounds(i, j);
        return this._matrix[this._cols * i + j];
    };

    set(i, j, value) {
        this.check_bounds(i, j);
        this._matrix[this._cols * i + j] = value;
    }

    check_bounds(i, j) {
        if (this._rows <= i) throw new RangeError(`i should be lesser than ${this._rows}`);
        if (this._cols <= j) throw new RangeError(`j should be lesser than ${this._cols}`);
    }

    to_string() {
        let str = "";

        this.forEach((curr_item, idx) => {
            if (idx && (idx + 1) % this._cols == 0) {
                str += curr_item + "\n";
            } else {
                str += curr_item + " ";
            }
        });

        return str.substring(0, str.length - 1);
    }

    get iterator() {
        let curr_row = 0;
        let curr_col = 0;

        return {
            next: () => {
                if (curr_col == this._cols) {
                    curr_col = 0;
                    curr_row++;
                }

                if (curr_row == this._rows) return null;

                const value = this.get(curr_row, curr_col);
                curr_col++;

                return value;
            }
        };
    }
}