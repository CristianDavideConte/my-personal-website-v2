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

    constructor(initial_value = null) {
        super();
        
        this.#head = null;
        this.#tail = null;
        this.#size = 0;

        if (initial_value) {
            this.push(initial_value);
        }
    }

    //O(1)
    push(value) {
        if (!this.#head) {
            this.#tail = new DoublyLinkedList(value);
            this.#head = this.#tail;
        } else {
            let new_tail = new DoublyLinkedList(value, null, this.#tail);
            this.#tail._prev = new_tail;
            this.#tail = new_tail;
        }

        this.#size++;
    }

    //O(1)
    push_front(value) {
        if (!this.#head) {
            this.#tail = new DoublyLinkedList(value);
            this.#head = this.#tail;
        } else {
            let new_head = new DoublyLinkedList(value, this.#head, null);
            this.#head._next = new_head;
            this.#head = new_head;
        }

        this.#size++;
    }

    //O(1)
    pop() {
        if (this.#size <= 1) {
            this.#head = null;
            this.#tail = null;
            this.#size = 0;
        } else {
            this.#head = this.#head.prev();
            this.#head._next = null;
            this.#size--;
        }
    }

    //O(1)
    tail() {
        return this.#tail.value();
    }

    //O(1)
    head() {
        return this.#head.value();
    }

    //O(1)
    top() {
        return this.head();
    }

    //O(1)
    isEmpty() {
        return !this.#tail;
    }

    //O(1)
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