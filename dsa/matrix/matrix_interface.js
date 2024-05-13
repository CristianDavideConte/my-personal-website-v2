import {
    Iterable
} from "../iterable.js";

export class MatrixInterface extends Iterable {
    #rows;
    #cols;
    #matrix;
    #size;

    constructor(rows, cols, matrix) { 
        super();
        
        this.#rows = rows;
        this.#cols = cols;
        this.#matrix = matrix;
        this.#size = this.#rows * this.#cols;
    };
    
    get(i, j) {
        this.check_bounds(i, j);
        return this.#matrix[this.#cols * i + j];
    };

    set(i, j, value) {
        this.check_bounds(i, j);
        this.#matrix[this.#cols * i + j] = value;
    }

    set_nth(idx, value) {
        if (this.#matrix.length <= idx) throw new RangeError(`idx should be lesser than ${this.#matrix.length}`);
        this.#matrix[idx] = value;
    }

    check_bounds(i, j) {
        if (this.#rows <= i) throw new RangeError(`i should be lesser than ${this.#rows}`);
        if (this.#cols <= j) throw new RangeError(`j should be lesser than ${this.#cols}`);
    }

    to_string() {
        let str = "";

        this.forEach((curr_item, idx) => {
            if (idx && (idx + 1) % this.#cols == 0) {
                str += curr_item + "\n";
            } else {
                str += curr_item + " ";
            }
        });

        return str.substring(0, str.length - 1);
    }

    size() {
        return this.#size;
    }

    get rows() { 
        return this.#rows;
    }

    get cols() {
        return this.#cols;
    } 

    get iterator() {
        let curr_row = 0;
        let curr_col = 0;

        return {
            next: () => {
                if (curr_col == this.#cols) {
                    curr_col = 0;
                    curr_row++;
                }

                if (curr_row == this.#rows) return null;

                const value = this.get(curr_row, curr_col);
                curr_col++;

                return value;
            }
        };
    }
}