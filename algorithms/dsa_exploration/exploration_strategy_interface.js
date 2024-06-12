import {
    Stack
} from "../../dsa/stack.js";

export class ExplorationStrategyInterface {
    retrieve_path(path_retrieval_order, start, goal) {
        const comparator = this.comparator;
        const path = new Stack(goal);
        let curr_node = goal;

        while (!comparator.equal(curr_node, start)) {
            curr_node = path_retrieval_order.get(curr_node); //iterable array
            path.push(curr_node);
        }

        return path;
    };

    get comparator() { throw new Error("Not implemented"); }
    explore() { throw new Error("Not implemented"); };
}