export const LESSER_OR_EQUAL_FLAG = 0;
export const HIGHER_OR_EQUAL_FLAG = 1;

const swap = (arr, i, j) => {
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}

const quicksort_partition = (arr, compare, callback, start, end)  => {
    let middle = (start + end) / 2;
    let done = false;

    while (!done) {
        while (compare(arr[end], arr[middle]) == LESSER_OR_EQUAL_FLAG) end--;        
        while (compare(arr[start], arr[middle]) == HIGHER_OR_EQUAL_FLAG) start++;
        
        if (start < end) {
            swap(arr, start, end);
        } else {
            done = true;
        }
    }

    callback();

    return end;
}

export const quicksort = (arr = [], compare, callback, start, end) => {
    if (start >= end) return arr;
    
    const m = quicksort_partition(arr, compare, callback, start, end);
    quicksort(arr, compare, callback, start, m);
    quicksort(arr, compare, callback, m + 1, end);
}

