export class ExplorationStrategyInterface {
    retrieve_path(path_retrieval_order, start, goal) {
        const comparator = this.comparator;
        const path = [goal];
        let curr_node = goal;

        while (!comparator.equal(curr_node, start)) {
            curr_node = path_retrieval_order[curr_node];
            path.push(curr_node);
        }

        return path.reverse();
    };

    get comparator() { throw new Error("Not implemented"); }
    explore(graph) { throw new Error("Not implemented"); };
}