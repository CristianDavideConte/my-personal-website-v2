import {
    Iterable
} from "./iterable.js";

export class PriorityQueue extends Iterable {
    #arr;
    #comparator;

    constructor(comparator = (a, b) => a > b) {
        super();

        this.#arr = []; // arr[arr.length - 1] contains the top element in the queue
        this.#comparator = comparator; // returns true if the priority of a is < than priority of b, false otherwise
    }

    //O(log(n))
    push(value) {
        if (this.isEmpty()) {
            this.#arr.push(value);
            return;
        }

        if (!this.#comparator(value, this.#arr[this.#arr.length - 1])) {
            this.#arr.push(value);
            return;
        }

        if (this.#comparator(value, this.#arr[0])) {
            this.#arr.splice(0, 0, value);
            return;
        }

        // Binary search
        let left = 0;
        let right = this.#arr.length - 1;
        let middle, left_condition, right_condition;

        while (left < right) {
            middle = Math.floor((left + right) / 2);
            left_condition = !this.#comparator(value, this.#arr[middle]);
            right_condition = this.#comparator(value, this.#arr[middle + 1]);

            if (left_condition && right_condition) {
                this.#arr.splice(middle + 1, 0, value);
                return;
            }

            if (left_condition) {
                left = middle + 1;
            } else {
                right = middle - 1;
            }
        }

        this.#arr.splice(left, 0, value);
    }

    //O(1)
    pop() {
        this.#arr.pop();
    }

    //O(1)
    top() {
        return this.#arr.length ? this.#arr[this.#arr.length - 1] : null;
    }

    //O(1)
    isEmpty() {
        return this.#arr.length == 0;
    }

    get iterator() {
        let curr_idx = this.#arr.length - 1;

        return {
            next: () => {
                if (curr_idx == -1) return null;

                const value = this.#arr[curr_idx];
                curr_idx--;

                return value;
            }
        };
    }
}