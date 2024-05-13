import {
    Iterable
} from "./iterable.js";
import {
    DoublyLinkedList
} from "./doubly_linked_list.js";

export class Queue extends Iterable {
    #head;
    #tail;
    #size;

    constructor() {
        super();

        this.#head = null;
        this.#tail = null;
        this.#size = 0;
    }

    push(value) {
        if (!this.#tail) {
            this.#tail = new DoublyLinkedList(value);
            this.#head = this.#tail;
        } else {
            let new_tail = new DoublyLinkedList(value, null, this.#tail);
            this.#tail._prev = new_tail;
            this.#tail = new_tail;
        }

        this.#size++;
    }

    pop() {
        if (this.#head === this.#tail) {
            this.#head = null;
            this.#tail = null;
        } else {
            this.#head = this.#head.prev();
            this.#head._next = null;
        }

        this.#size = Math.max(0, this.#size - 1);
    }

    tail() {
        return this.#tail.value();
    }

    head() {
        return this.#head.value();
    }

    top() {
        return this.head();
    }

    isEmpty() {
        return !this.#tail;
    }

    size() {
        return this.#size;
    }

    get iterator() {
        let curr_node = this.#head;

        return {
            next: () => {
                if (!curr_node) return curr_node;

                const node = curr_node;
                curr_node = curr_node.prev();
                return node.value();
            }
        };
    }
}