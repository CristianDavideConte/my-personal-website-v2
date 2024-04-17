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

        this.#delta = 100;
        this.#num_iter = 100;
        //this.#threshold = 5;
    }

    placeNodes(graph, min_x, min_y, max_x, max_y) {
        const nodes_list = new IterableSet(graph.nodes());

        const nodes_pos = new Map();
        const nodes_forces = new Map();

        let curr_iter = 0;
        let max_force_x = 1;
        let max_force_y = 1;
        
        let poses = [
            [250, 200],
            [250, 500],
            [500, 500],
            [500, 200],
            [50, 200],
        ]

        nodes_list.forEach((node, idx) => {
            nodes_pos.set(node, [
                Math.random() * (max_x - min_x) + min_x,
                Math.random() * (max_y - min_y) + min_y
            ]);
            //nodes_pos.set(node, poses[idx]) //TODO: debug, remove
        });

        while (curr_iter < this.#num_iter) { // && max_force >= this.#threshold
            console.log("iter")

            // Calculate the forces acting on each node
            nodes_list.forEach((node, idx) => {
                const node_nbs = graph.neighborsOf(node);
                const other_nodes = [];

                let node_forces = [0, 0];
                        
                // Find nodes that are not neighbors of the current node
                nodes_list.forEach((other_node, idx) => {
                    if (node == other_node) return;
                    if (node_nbs.includes(other_node)) return;
                    other_nodes.push(other_node);
                });

                // Calculate repulsive forces of the current node
                other_nodes.forEach((other_node, idx) => {
                    const forces = this.#repulsiveForce(nodes_pos, node, other_node);
                    
                    console.log("rep", node, other_node, forces);

                    node_forces[0] = node_forces[1] + forces[0];
                    node_forces[1] = node_forces[1] + forces[1];
                });

                // Calculate the attractive forces of the current node
                node_nbs.forEach((nb, idx) => {
                    const forces = this.#attractiveForce(nodes_pos, node, nb);

                    console.log("attr". node, nb, forces);

                    node_forces[0] = node_forces[1] + forces[0];
                    node_forces[1] = node_forces[1] + forces[1];
                });
                
                nodes_forces.set(node, node_forces);

                max_force_x = Math.max(max_force_x, node_forces[0]);
                max_force_y = Math.max(max_force_y, node_forces[0]);
            });

            // Apply the calculated forces on each node
            nodes_list.forEach((node, idx) => {
                let node_pos = nodes_pos.get(node);
                let forces = nodes_forces.get(node);

                node_pos[0] = Math.min(max_x, Math.max(min_x, node_pos[0] + this.#delta * forces[0]));
                node_pos[1] = Math.min(max_y, Math.max(min_y, node_pos[1] + this.#delta * forces[1]));

                nodes_pos.set(node, node_pos);
            });

            curr_iter++;
        }

        return nodes_pos;
    }

    #repulsiveForce(nodes_pos, node_1, node_2) {
        const c_rep = 3; //TODO, play with this number (repulsive constant)

        let [delta_x, delta_y] = this.#distanceL1(nodes_pos, node_1, node_2);
        const [dir_x, dir_y] = [Math.sign(delta_x), Math.sign(delta_y)];

        delta_x = dir_x === 0 ? c_rep : dir_x * c_rep / (delta_x * delta_x);
        delta_y = dir_y === 0 ? c_rep : dir_y * c_rep / (delta_y * delta_y);

        return [delta_x, delta_y];
    }

    #attractiveForce(nodes_pos, node_1, node_2) {
        const c_spring = 0.1; //TODO, play with this number (spring constant)
        const l_spring = 200; //TODO, play with this number (spring length)

        const [delta_x, delta_y] = this.#distanceL1(nodes_pos, node_2, node_1);
        const [dir_x, dir_y] = [Math.sign(delta_x), Math.sign(delta_y)];

        const distance = this.#distanceL2(nodes_pos, node_1, node_2);

        return [
            dir_x * c_spring * Math.log10(distance / l_spring),
            dir_y * c_spring * Math.log10(distance / l_spring)
        ];
    }

    #distanceL1(nodes_pos, node_1, node_2) {
        const pos_1 = nodes_pos.get(node_1);
        const pos_2 = nodes_pos.get(node_2);

        const delta_x = pos_1[0] - pos_2[0];
        const delta_y = pos_1[1] - pos_2[1];

        return [delta_x, delta_y];
    }

    #distanceL2(nodes_pos, node_1, node_2) {
        const [delta_x, delta_y] = this.#distanceL1(nodes_pos, node_1, node_2);

        return Math.sqrt(delta_x * delta_x + delta_y * delta_y);
    }

    #sign(num) {
        return num >= 0 ? 1 : -1;
    }
}