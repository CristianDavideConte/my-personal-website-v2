export class Iterable { // Abstract class
    get iterator() { return null };
    
    size() { return null; }

    forEach(callback = () => { }) {
        const iterator = this.iterator;
        let curr_item = iterator.next();
        let idx = 0;

        while (curr_item != null) {
            callback(curr_item, idx);

            curr_item = iterator.next();
            idx++;
        }
    }

    to_string() {
        let str = "";

        this.forEach((curr_item, idx) => {
            str += curr_item + " ";
        });

        return str.substring(0, str.length - 1);
    }
}