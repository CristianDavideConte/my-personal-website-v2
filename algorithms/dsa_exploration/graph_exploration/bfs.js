import {
    IterableArray
} from "../../../dsa/iterable_array.js";

import {
    Queue
} from "../../../dsa/queue.js";

import {
    GraphExplorationStrategy
} from "./graph_exploration_strategy_interface.js";

export class BFSStrategy extends GraphExplorationStrategy {
    explore(graph, start = graph.startingNode()) {
        const exploration_order = [];
        const path_retrieval_order = [];

        this.#explore_impl(graph.graph(), exploration_order, path_retrieval_order, new Set(), start);

        return [new IterableArray(exploration_order), new IterableArray(path_retrieval_order)];
    }

    #explore_impl(graph, exploration_order, path_retrieval_order, seen, start) {
        const queue = new Queue();
        let curr_node;

        queue.push(start);

        while (!queue.isEmpty()) {
            curr_node = queue.head();
            queue.pop();

            exploration_order.push(curr_node);
            seen.add(curr_node);

            for (const nb of graph.get(curr_node)) {
                if (seen.has(nb)) continue;

                path_retrieval_order[nb] = curr_node;
                queue.push(nb);
                seen.add(nb);
            }
        }
    }

    get comparator() {
        return {
            equal: (a, b) => a === b
        }
    }
}