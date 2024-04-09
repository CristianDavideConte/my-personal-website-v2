export const linear = (arr = [], fun = () => { }, start_idx = 0) => {
    let new_arr = [];

    for (let i = start_idx; i < arr.length; i++) {
        new_arr.push(fun(arr[i], i));
    }

    for (let i = 0; i < start_idx; i++) {
        new_arr.push(fun(arr[i], i));
    }

    return new_arr;
}