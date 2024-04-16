import {
    IterableSet
} from "../../dsa/iterable_set.js";

import {
    GraphVisualizationStrategy
} from "./strategy_interface.js";

// Source: https://i11www.iti.kit.edu/_media/teaching/winter2016/graphvis/graphvis-ws16-v6.pdf
export class SpringEmbedderStrategy extends GraphVisualizationStrategy {
    #delta;
    #num_iter;
    #threshold;

    constructor() {
        super();

        this.#delta = 1;
        this.#num_iter = 10;
        this.#threshold = 1;
    }

    placeNodes(graph, min_x, min_y, max_x, max_y) {
        const nodes_list = new IterableSet(graph.nodes());
        const nodes_pos = new Map();
        const nodes_forces = new Map();
        let curr_iter = 0;
        let max_force = Number.MAX_VALUE;
        
        nodes_list.forEach((node, idx) => {
            nodes_pos.set(node, [
                Math.random() * (max_x - min_x) + min_x,
                Math.random() * (max_y - min_y) + min_y
            ]);
        });
        
        while (curr_iter < this.#num_iter && max_force > this.#threshold) {
            max_force = Number.MIN_VALUE;

            nodes_list.forEach((node, idx) => {
                const node_nbs = graph.neighborsOf(node);
                const other_nodes = [];

                let node_forces = [0, 0];
                        
                // Find nodes that are not neighbors of the current node
                nodes_list.forEach((other_node, idx) => {
                    if (node == other_node) return;
                    if (node_nbs.includes(other_nodes)) return;
                    other_nodes.push(other_node);
                });

                // Apply repulsive forces to the current node
                other_nodes.forEach((other_node, idx) => {
                    const forces = this.#repulsiveForce(nodes_pos, node, other_node);
                    node_forces[0] += forces[0];
                    node_forces[1] += forces[1];
                });

                // Apply attractive forces to the current node
                node_nbs.forEach((nb, idx) => {
                    const forces = this.#attractiveForce(nodes_pos, node, nb);
                    node_forces[0] += forces[0];
                    node_forces[1] += forces[1];
                });
                
                nodes_forces.set(node, node_forces);

                max_force = Math.max(
                    max_force,
                    Math.sqrt(node_forces[0] ** 2 + nodes_forces[1] ** 2)
                );
            });

            nodes_list.forEach((node, idx) => {
                let node_pos = nodes_pos.get(node);
                let forces = nodes_forces.get(node);

                node_pos[0] += Math.min(max_x, Math.max(min_x, this.#delta * forces[0]));
                node_pos[1] += Math.min(max_y, Math.max(min_y, this.#delta * forces[1]));

                nodes_pos.set(node, node_pos);
            });

            curr_iter++;
        }

        return nodes_pos;
    }

    #repulsiveForce(nodes_pos, node1, node2) {
        const c_rep = 1; //TODO, play with this number (repulsive constant)

        const pos_1 = nodes_pos.get(node1);
        const pos_2 = nodes_pos.get(node2);

        return [
            c_rep / (pos_1[0] - pos_2[0]) ** 2,
            c_rep / (pos_1[1] - pos_2[1]) ** 2
        ];
    }

    #attractiveForce(nodes_pos, node1, node2) {
        const c_spring = 1; //TODO, play with this number (spring constant)
        const l_spring = 2; //TODO, play with this number (spring length)

        const pos_1 = nodes_pos.get(node1);
        const pos_2 = nodes_pos.get(node2);

        return [
            c_spring * Math.log(Math.max(1, (pos_1[0] - pos_2[0]) / l_spring)), //TODO, the log is currently in base e, not base 10
            c_spring * Math.log(Math.max(1, (pos_1[1] - pos_2[1]) / l_spring))
        ];
    }
}