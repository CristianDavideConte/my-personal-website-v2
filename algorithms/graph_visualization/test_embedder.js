import {
    IterableSet
} from "../../dsa/iterable_set.js";

import {
    GraphVisualizationStrategy
} from "./strategy_interface.js";

export class TestEmbedderStrategy extends GraphVisualizationStrategy {
    #L;
    #min_x;
    #min_y;
    #max_x;
    #max_y;

    constructor(min_x, min_y, max_x, max_y) {
        super();

        this.#L = 200;
        this.#min_x = min_x;
        this.#max_x = max_x;
        this.#min_y = min_y;
        this.#max_y = max_y;
    }

    // Initialize positions of nodes randomly within a specified bounding box
    getInitialNodePositions(graph) {
        const nodes_list = new IterableSet(graph.nodes());
        const nodes_pos = new Map();

        nodes_list.forEach((node, idx) => {
            nodes_pos.set(node, [
                Math.random() * ((this.#max_x - this.#min_x) + this.#min_x),
                Math.random() * ((this.#max_y - this.#min_y) + this.#min_y)
                //(this.#max_x + this.#min_y) / 2,
                //(this.#max_x + this.#min_y) / 2,
            ]);
        });

        return nodes_pos;
    }

    // Function to place nodes iteratively while enforcing distance constraints
    updatePlacement(graph, initial_poses) {
        const nodes_pos = initial_poses;

        // Update positions of each node based on average position of neighbors
        for (const node of graph.nodes()) {
            let neighbors = graph.neighborsOf(node);
            
            if (neighbors.length > 0) {
                let sumX = 0;
                let sumY = 0;

                // Calculate average position of neighboring nodes
                for (const nb of neighbors) {
                    let node_pos = nodes_pos.get(nb);
                    sumX += node_pos[0];
                    sumY += node_pos[1];
                }

                let averageX = sumX / neighbors.length;
                let averageY = sumY / neighbors.length;
                
                nodes_pos.set(node, [averageX, averageY]);
            } 
        }

        // Enforce distance constraints with neighboring nodes
        for (const node of graph.nodes()) {
            let node_pos = nodes_pos.get(node);
            let neighbors = graph.neighborsOf(node);

            for (const nb of neighbors) {
                let nb_pos = nodes_pos.get(nb);
                let currentDistance = this.#distanceL2(node_pos, nb_pos);
                let desiredDistance = this.#L;

                // Adjust node position to meet desired distance constraint
                if (currentDistance !== 0) {
                    let scaleFactor = desiredDistance / currentDistance;
                    let deltaX = nb_pos[0] - node_pos[0];
                    let deltaY = nb_pos[1] - node_pos[1];
                    node_pos[0] += deltaX * scaleFactor;
                    node_pos[1] += deltaY * scaleFactor;
                }
            }

            node_pos[0] = Math.min(this.#max_x, Math.max(this.#min_x, node_pos[0]));
            node_pos[1] = Math.min(this.#max_y, Math.max(this.#min_y, node_pos[1]));

            nodes_pos.set(node, node_pos);
        }

        return nodes_pos;
    }

    // Helper function to calculate Euclidean distance between two points
    #distanceL2(point1, point2) {
        return Math.sqrt(Math.pow(point2[0] - point1[0], 2) + Math.pow(point2[1] - point1[1], 2));
    }
}