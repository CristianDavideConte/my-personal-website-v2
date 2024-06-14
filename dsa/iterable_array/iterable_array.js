import {
    Sortable
} from "../sortable.js";

export class IterableArray extends Sortable {
    #arr;

    constructor(arr = [], sorting_strategy = () => { }) {
        super(sorting_strategy);

        this.#arr = arr;
    }

    //O(1)
    swap(i, j) {
        const temp = this.#arr[i];
        this.#arr[i] = this.#arr[j];
        this.#arr[j] = temp;
    }

    //O(N)
    shuffle(callback = () => { }) {
        for (let i = this.size() - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            callback(i, j);
            this.swap(i, j);
        }
    }

    //O(Depends on the sorting strategy)
    sort(start = 0, end = this.size() - 1, callback = () => { }) {
        this.sorting_strategy.sort(this, start, end, callback);
    }
    
    //O(1)
    get(key) {
        return this.#arr[key];
    }

    //O(1)
    set(key, value) {
        this.#arr[key] = value;
    }

    //O(1)
    push(value) {
        this.#arr.push(value);
    }

    //O(1)
    pop() {
        this.#arr.pop();
    }

    //O(1)
    size() {
        return this.#arr.length || Object.keys(this.#arr).length;
    }

    get iterator() {
        const iterator = this.#arr[Symbol.iterator]();

        return {
            next: () => {
                const next = iterator.next();
                return next.done ? null : next.value;
            }
        };
    }
}