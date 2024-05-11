export class BuilderInterface {
    _rows;
    _cols;
    _matrix;

    constructor(rows, cols) { 
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

    to_string() {
        let str = "";

        for (let i = 0; i < this._rows; i++) {
            for (let j = 0; j < this._cols; j++) {
                str += this.get(i, j) + " ";
            }
            str += "\n";
        }

        return str;
    }

    check_bounds(i, j) {
        if (this._rows <= i) throw new RangeError(`i should be lesser than ${this._rows}`);
        if (this._cols <= j) throw new RangeError(`j should be lesser than ${this._cols}`);
    }
}