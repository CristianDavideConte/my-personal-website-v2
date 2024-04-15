import {
    GraphExplorationStrategy
} from "./strategy_iterface.js";

export class DFSStrategy extends GraphExplorationStrategy {
    explore(graph) {
        const exploration_order = [];

        this.#explore_impl(graph.graph(), exploration_order, new Set(), graph.startingNode()); 
        
        return exploration_order;
    }

    #explore_impl(graph, exploration_order, seen, start) {
        if (seen.has(start)) return;
        
        exploration_order.push(start);
        seen.add(start);

        if (!graph.get(start)) return;

        for (const nb of graph.get(start)) {
            this.#explore_impl(graph, exploration_order, seen, nb);
        }
    }
}