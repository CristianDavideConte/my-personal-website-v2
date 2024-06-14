import {
    SortingStrategy
} from "./sorting_strategy_interface.js";

export class QuicksortStrategy extends SortingStrategy {
    // Note: dsa must implement the Sortable interface
    sort(dsa, start, end, callback = () => { }) {
        if (start >= end) return;

        const m = this.#quicksort_partition(dsa, start, end, callback);
        this.sort(dsa, start, m - 1, callback);
        this.sort(dsa, m + 1, end, callback);
    }

    #quicksort_partition(dsa, start, end, callback) {
        let pivot = dsa.get(end);
        let cmp_res;

        start--;

        for (let i = start + 1; i < end; i++) {
            cmp_res = this.compare_fun(dsa.get(i), pivot);

            if (cmp_res == this.LESSER_FLAG) {
                start++;
                callback(dsa, start, i);
                dsa.swap(start, i);
            }
        }

        callback(dsa, start + 1, end);
        dsa.swap(start + 1, end);

        return start + 1;
    }
}