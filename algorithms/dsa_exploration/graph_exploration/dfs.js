import {
    GraphExplorationStrategy
} from "./graph_exploration_strategy_interface.js";

export class DFSStrategy extends GraphExplorationStrategy {
    explore(graph, start = graph.startingNode()) {
        const exploration_order = [];
        const path_retrieval_order = [];

        this.#explore_impl(graph.graph(), exploration_order, path_retrieval_order, new Set(), start); 
        
        return [exploration_order, path_retrieval_order];
    }

    #explore_impl(graph, exploration_order, path_retrieval_order, seen, start) {
        if (seen.has(start)) return;
        
        exploration_order.push(start);
        seen.add(start);

        if (!graph.get(start)) return;

        for (const nb of graph.get(start)) {
            this.#explore_impl(graph, exploration_order, path_retrieval_order, seen, nb);
            path_retrieval_order[nb] = start;
        }
    }

    get comparator() {
        return {
            equal: (a, b) => a === b
        }
    }
}