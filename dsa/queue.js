import {
    Iterable
} from "/dsa/iterable.js";

import {
    DoublyLinkedList
} from "/dsa/doubly_linked_list.js";

export class Queue extends Iterable {
    #head;
    #tail;

    constructor() {
        super();

        this.#head = null;
        this.#tail = null;
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
    }

    pop() {
        if (this.#head === this.#tail) {
            this.#head = null;
            this.#tail = null;
        } else {
            this.#head = this.#head.prev();
            this.#head._next = null;
        }
    }

    tail() {
        return this.#tail.value();
    }

    head() {
        return this.#head.value();
    }

    isEmpty() {
        return !this.#tail;
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