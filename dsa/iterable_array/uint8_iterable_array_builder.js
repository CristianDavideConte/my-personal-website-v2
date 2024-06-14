import {
    IterableArray
} from "./iterable_array.js";

export class UInt8IterableArrayBuilder {
    build(size, initial_value = 0) {
        return new IterableArray(
            new Uint8Array(
                new Array(size).fill(initial_value)
            )
        );
    }
}