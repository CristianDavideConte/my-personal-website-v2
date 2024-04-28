import {
    IterableSet
} from "../../dsa/iterable_set.js";

import {
    GraphVisualizationStrategy
} from "./strategy_interface.js";

// Source: https://i11www.iti.kit.edu/_media/teaching/winter2016/graphvis/graphvis-ws16-v6.pdf
export class ForceDirectedGravityStrategy extends GraphVisualizationStrategy {
    #min_x;
    #min_y;
    #max_x;
    #max_y;
    #center_pos;

    #node_radius;
    #forces_dumping; // force multiplier
    #temp_cooldown_factor; // forces_dumping cooldown factor
    #graph_diameter;

    constructor(min_x, min_y, max_x, max_y) {
        super();

        this.#min_x = min_x;
        this.#max_x = max_x;
        this.#min_y = min_y;
        this.#max_y = max_y;
        this.#center_pos = [(max_x - min_x) / 2, (max_y - min_y) / 2];

        this.#node_radius = 50; //TODO, make this an input parameter
        this.#forces_dumping = 0.85;
        this.#temp_cooldown_factor = 0.99;

        this.#graph_diameter = -1;
    }

    getInitialNodePositions(graph) {
        const nodes_list = new IterableSet(graph.nodes());
        const nodes_pos = new Map();

        let prev_x = Math.random() * (this.#max_x - this.#min_x) + this.#min_x;
        let prev_y = Math.random() * (this.#max_y - this.#min_y) + this.#min_y;

        nodes_list.forEach((node, idx) => {
            const new_x = Math.min(this.#max_x, Math.max(this.#min_x, prev_x + (Math.random() * 2 - 1) * 2 * this.#node_radius));
            const new_y = Math.min(this.#max_y, Math.max(this.#min_y, prev_y + (Math.random() * 2 - 1) * 2 * this.#node_radius));

            prev_x = new_x;
            prev_y = new_y;

            nodes_pos.set(node, [new_x, new_y]);
        });

        return nodes_pos;
    }

    updatePlacement(graph, initial_poses) {
        let nodes_list = Array.from(graph.nodes()); //new IterableSet();

        const nodes_pos = initial_poses;
        const nodes_forces = new Map();

        nodes_pos.set("graph_center", this.#center_pos);

        //if (this.#graph_diameter == -1) {
            this.#graph_diameter = this.#diameter(nodes_pos);
        //}

        // Calculate the forces acting on each node
        nodes_list.forEach((node, idx) => {
            const node_nbs = graph.neighborsOf(node);
            const other_nodes = [];

            let node_pos = nodes_pos.get(node);
            let node_forces = [0, 0];

            // Find nodes that are not neighbors of the current node
            nodes_list.forEach((other_node, idx) => {
                if (node == other_node) return;
                //if (node_nbs.includes(other_node)) return;
                other_nodes.push(other_node);
            });

            // Calculate the attractive forces of the current node
            node_nbs.forEach((nb, idx) => {
                const forces = this.#attractiveForce(nodes_pos, nb, node);
                node_forces[0] = node_forces[1] + forces[0];
                node_forces[1] = node_forces[1] + forces[1];
            });

            // Calculate repulsive forces of the current node
            other_nodes.forEach((other_node, idx) => {
                const forces = this.#repulsiveForce(nodes_pos, node, other_node);
                node_forces[0] = node_forces[1] + forces[0];
                node_forces[1] = node_forces[1] + forces[1];
            });

            // Calculate the attractive force to the center of the graph
            {
                const forces = this.#centerForce(nodes_pos, "graph_center", node);
                node_forces[0] = node_forces[1] + forces[0];
                node_forces[1] = node_forces[1] + forces[1];
            }
            
            // Dumping of the forces
            {
                node_forces[0] *= this.#forces_dumping;
                node_forces[1] *= this.#forces_dumping;
            }

            node_pos[0] = Math.min(this.#max_x, Math.max(this.#min_x, node_pos[0] + node_forces[0]));
            node_pos[1] = Math.min(this.#max_y, Math.max(this.#min_y, node_pos[1] + node_forces[1]));

            nodes_forces.set(node, node_forces);
            nodes_pos.set(node, node_pos);
        });

        this.#forces_dumping *= this.#temp_cooldown_factor;
        return nodes_pos;
    }

    #repulsiveForce(nodes_pos, node_1, node_2) {
        let [delta_x, delta_y] = this.#distanceL1(nodes_pos, node_1, node_2);

        if (delta_x == 0 && delta_y == 0) {
            delta_x = Math.random() * 2 - 1; //between -1 and 1
            delta_y = Math.random() * 2 - 1; //between -1 and 1
        }

        const distance_2 = delta_x * delta_x + delta_y * delta_y;
        const gravity_distance_2 = 1e0 * Math.pow(3 * this.#graph_diameter, 2); 

        return [
            (delta_x / gravity_distance_2) * distance_2,
            (delta_y / gravity_distance_2) * distance_2
        ];
    }

    #attractiveForce(nodes_pos, node_1, node_2) {
        let [delta_x, delta_y] = this.#distanceL1(nodes_pos, node_1, node_2);

        if (delta_x == 0 && delta_y == 0) {
            delta_x = Math.random() * 2 - 1; //between -1 and 1
            delta_y = Math.random() * 2 - 1; //between -1 and 1
        }

        const distance_2 = delta_x * delta_x + delta_y * delta_y;
        const distance = Math.sqrt(distance_2);
        const kof = 1e0 / (3 * this.#graph_diameter);

        return [
            delta_x / ((distance - 3 * this.#graph_diameter) * kof),
            delta_y / ((distance - 3 * this.#graph_diameter) * kof)
        ];
    }

    //node_1 is always the center
    #centerForce(nodes_pos, node_1, node_2) { 
        let [delta_x, delta_y] = this.#distanceL1(nodes_pos, node_1, node_2);

        if (delta_x == 0 && delta_y == 0) {
            delta_x = Math.random() * 2 - 1; //between -1 and 1
            delta_y = Math.random() * 2 - 1; //between -1 and 1
        }

        const distance_2 = delta_x * delta_x + delta_y * delta_y;
        const distance = Math.sqrt(distance_2);
        const k_center_force = 1e2 / (3 * this.#graph_diameter);

        return [
            delta_x / (distance * k_center_force),
            delta_y / (distance * k_center_force)
        ];
    }

    #distanceL1(nodes_pos, node_1, node_2) {
        const pos_1 = nodes_pos.get(node_1);
        const pos_2 = nodes_pos.get(node_2);

        const [node_1_left, node_1_right] = [pos_1[0], pos_1[0] + 2 * this.#node_radius];
        const [node_2_left, node_2_right] = [pos_2[0], pos_2[0] + 2 * this.#node_radius];

        const [node_1_top, node_1_bottom] = [pos_1[1], pos_1[1] + 2 * this.#node_radius];
        const [node_2_top, node_2_bottom] = [pos_2[1], pos_2[1] + 2 * this.#node_radius];

        /* */
        return [
            Math.abs((node_1_right + node_1_left) / 2 - (node_2_right + node_2_left) / 2),
            Math.abs((node_1_bottom + node_1_top) / 2 - (node_2_bottom + node_2_top) / 2),
        ];

        const delta_x = Math.min(
            Math.abs(node_1_left - node_2_left),
            Math.abs(node_1_left - node_2_right),
            Math.abs(node_1_right - node_2_left),
            Math.abs(node_1_right - node_2_right)
        );

        const delta_y = Math.min(
            Math.abs(node_1_top - node_2_top),
            Math.abs(node_1_top - node_2_bottom),
            Math.abs(node_1_bottom - node_2_top),
            Math.abs(node_1_bottom - node_2_bottom)
        );

        const sign_x = Math.sign(node_1_left - node_2_left);
        const sign_y = Math.sign(node_1_top - node_2_top);

        return [sign_x * delta_x, sign_y * delta_y];
    }

    #diameter(nodes_pos) {
        let diameter = Number.MIN_SAFE_INTEGER;

        for (const [node_1, node_pos] of nodes_pos) {
            for (const [node_2, node_pos] of nodes_pos) {
                const [delta_x, delta_y] = this.#distanceL1(nodes_pos, node_1, node_2);
                diameter = Math.max(diameter, delta_x * delta_x + delta_y * delta_y);
            }
        }

        return Math.sqrt(diameter);
    }
}