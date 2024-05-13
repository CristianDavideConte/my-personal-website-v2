import {
    Iterable
} from "./iterable.js";

export class DoublyLinkedList extends Iterable {
    _value;
    _prev;
    _next;

    constructor(value = null, prev = null, next = null) {
        super();

        this._value = value;
        this._prev = prev;
        this._next = next;
    }

    prev() {
        return this._prev;
    }

    next() {
        return this._next;
    }

    value() {
        return this._value;
    }

    // O(n)
    size() {
        let size = 1;
        let head = this.prev();
        let tail = this.next();

        while (head) {
            head = head.prev();
            size++;
        }

        while (tail) {
            tail = tail.next();
            size++;
        }
        
        return size;
    }

    get iterator() { 
        let curr_node = this;

        // Retrieves the head of the list
        while (curr_node.prev()) {
            curr_node = curr_node.prev();
        }

        return {
            next: () => {
                if (!curr_node) return curr_node;

                const node = curr_node;
                curr_node = curr_node.next();
                return node;
            }
        };
    }
}