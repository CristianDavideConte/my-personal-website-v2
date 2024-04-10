export const LESSER_FLAG = -1;
export const EQUAL_FLAG = 0;
export const HIGHER_FLAG = 1;

const swap = (arr, i, j) => {
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}

const quicksort_partition = (arr, compare, callback, start, end)  => {
    let pivot = arr[end];
    let cmp_res;

    start--;

    for (let i = start + 1; i < end; i++) {
        cmp_res = compare(arr[i], pivot);

        if (cmp_res == LESSER_FLAG || cmp_res == EQUAL_FLAG) {
            start++;
            swap(arr, start, i);
        }
    }

    swap(arr, start + 1, end);    

    callback();

    return start + 1;
}

export const quicksort = (arr = [], compare, callback, start, end) => {
    if (start >= end) return;

    console.log(start, end)
    
    const m = quicksort_partition(arr, compare, callback, start, end);
    quicksort(arr, compare, callback, start, m - 1);
    quicksort(arr, compare, callback, m + 1, end);
}


/* Randomize array in-place using Durstenfeld shuffle algorithm */
export function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        swap(arr, i, j);
    }
}

