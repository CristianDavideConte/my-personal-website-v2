export class Iterable { // Abstract class
    //O(N)
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

    //O(N)
    to_string() {
        let str = "";

        this.forEach((curr_item, idx) => {
            str += curr_item + " ";
        });

        return str.substring(0, str.length - 1);
    }
    
    size() { throw new Error("Not implemented"); };
    get iterator() { throw new Error("Not implemented"); };
}