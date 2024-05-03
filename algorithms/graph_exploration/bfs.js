import {
    Queue
} from "../../dsa/queue.js";

import {
    GraphExplorationStrategy
} from "./strategy_interface.js";

export class BFSStrategy extends GraphExplorationStrategy {
    explore(graph) {
        const exploration_order = [];

        this.#explore_impl(graph.graph(), exploration_order, new Set(), graph.startingNode());

        return exploration_order;
    }

    #explore_impl(graph, exploration_order, seen, start) {
        let queue = new Queue();
        let curr_node;

        queue.push(start);

        while (!queue.isEmpty()) {
            curr_node = queue.head();
            queue.pop();

            exploration_order.push(curr_node);
            seen.add(curr_node);

            for (const nb of graph.get(curr_node)) {
                if (seen.has(nb)) continue;

                queue.push(nb);
                seen.add(nb);
            }
        }
    }
}