import {
    Iterable
} from "./iterable.js";

import {
    DoublyLinkedList
} from "./doubly_linked_list.js";

export class Stack extends Iterable {
    #head;
    #size;

    constructor(initial_value = null) {
        super();

        this.#head = null;
        this.#size = 0;

        if (initial_value) {
            this.push(initial_value);
        }
    }

    push(value) {
        if (!this.#head) {
            this.#head = new DoublyLinkedList(value);
        } else {
            let new_head = new DoublyLinkedList(value, this.#head, null);
            this.#head._next = new_head;
            this.#head = new_head;
        }

        this.#size++;
    }

    pop() {
        if (this.#size <= 1) {
            this.#head = null;
            this.#size = 0;
        } else {
            this.#head = this.#head.prev();
            this.#head._next = null;
            this.#size--;
        }
    }

    head() {
        return this.#head.value();
    }

    top() {
        return this.head();
    }

    isEmpty() {
        return !this.#head;
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