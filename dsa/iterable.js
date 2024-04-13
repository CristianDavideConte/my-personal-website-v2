export class Iterable { // Abstract class
    get iterator() { return null };

    iterate(callback = () => { }) {
        const iterator = this.iterator;
        let curr_item = iterator.next();
        let idx = 0;

        while (curr_item) {
            callback(curr_item, idx);

            curr_item = iterator.next();
            idx++;
        }
    };
}