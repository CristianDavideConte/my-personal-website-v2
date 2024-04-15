import {
    Iterable
} from "./iterable.js";

export class Graph extends Iterable {
    #starting_node;
    #graph;
    #exploration_strategy;

    constructor(adj_list = [[]], exploration_strategy) {
        super();
        
        this.#starting_node = adj_list[0][0];
        this.#graph = new Map();
        this.#exploration_strategy = exploration_strategy;

        for (const adj of adj_list) {
            if (!this.#graph.has(adj[0])) {
                this.#graph.set(adj[0], []);
            }
            
            if (!this.#graph.has(adj[1])) {
                this.#graph.set(adj[1], []);
            }

            this.#graph.get(adj[0]).push(adj[1]);
            this.#graph.get(adj[1]).push(adj[0]);   
        }
    }

    graph() {
        return this.#graph;
    }

    startingNode() {
        return this.#starting_node;
    }

    get iterator() {
        const exploration_order = this.#exploration_strategy.explore(this);
        const n = exploration_order.length;
        let i = 0;

        return {
            next: () => {
                if (i == n) return null;
                return exploration_order[i++];
            }
        };
    }
}