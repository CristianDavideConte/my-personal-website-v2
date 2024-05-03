import {
    IterableSet
} from "/dsa/iterable_set.js";

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

    #forces_dumping; // force multiplier
    #temp_cooldown_factor; // forces_dumping cooldown factor
    #node_diameter;
    #max_distance;

    constructor(min_x, min_y, max_x, max_y, node_diameter) {
        super();

        this.#node_diameter = node_diameter; // In px
        this.#max_distance = 4 * this.#node_diameter; //TODO: play with this number, it actually is the maximum distance between 2 nodes

        this.#min_x = min_x;
        this.#min_y = min_y;
        this.#max_x = max_x - this.#node_diameter;
        this.#max_y = max_y - this.#node_diameter;

        this.#center_pos = [
            (this.#min_x + this.#max_x) / 2,
            (this.#min_y + this.#max_y) / 2
        ];

        this.#forces_dumping = 0.85;
        this.#temp_cooldown_factor = 1//0.9999;
    }

    getInitialNodePositions(graph) {
        const nodes_list = new IterableSet(graph.nodes());
        const nodes_pos = new Map();

        nodes_list.forEach((node, idx) => {
            const new_x = Math.random() * (this.#max_x - this.#min_x) + this.#min_x;
            const new_y = Math.random() * (this.#max_y - this.#min_y) + this.#min_y;
            nodes_pos.set(node, [new_x, new_y]);
        });
        
        nodes_pos.set("graph_center", this.#center_pos);

        return nodes_pos;
    }

    updatePlacement(graph, initial_poses) {
        let nodes_list = new IterableSet(graph.nodes());
        const nodes_pos = initial_poses;

        // Calculate the forces acting on each node
        nodes_list.forEach((node, idx) => {
            const node_nbs = graph.neighborsOf(node);

            let node_pos = nodes_pos.get(node);
            let node_forces = [0, 0];

            // Calculate repulsive forces of the current node
            nodes_list.forEach((other_node, idx) => {
                if (node == other_node) return;

                const forces = this.#repulsiveForce(nodes_pos, node, other_node);
                node_forces[0] += forces[0];
                node_forces[1] += forces[1];
            });

            // Calculate the attractive forces of the current node
            node_nbs.forEach((nb, idx) => {
                const forces = this.#attractiveForce(nodes_pos, nb, node);
                node_forces[0] += forces[0];
                node_forces[1] += forces[1];
            });

            // Calculate the attractive force to the center of the graph
            {
                const forces = this.#centerForce(nodes_pos, node);
                node_forces[0] += forces[0];
                node_forces[1] += forces[1];
            }
            
            // Limiting of the forces' strength
            {
                this.#capForces(node_forces);
            }

            node_pos[0] = Math.min(this.#max_x, Math.max(this.#min_x, node_pos[0] + node_forces[0]));
            node_pos[1] = Math.min(this.#max_y, Math.max(this.#min_y, node_pos[1] + node_forces[1]));

            nodes_pos.set(node, node_pos);
        });

        this.#forces_dumping *= this.#temp_cooldown_factor;

        return nodes_pos;
    }

    #repulsiveForce(nodes_pos, node_1, node_2) {
        const [delta_x, delta_y] = this.#distanceL1(nodes_pos, node_1, node_2);
        
        const distance_2 = delta_x * delta_x + delta_y * delta_y;
        const distance = Math.sqrt(distance_2);
        const gravity_distance_2 = 5e0 * this.#max_distance * this.#max_distance;
        const force = gravity_distance_2 / distance_2;

        return [
            delta_x / distance * force,
            delta_y / distance * force
        ];
    }

    #attractiveForce(nodes_pos, node_1, node_2) {
        const [delta_x, delta_y] = this.#distanceL1(nodes_pos, node_1, node_2);

        const distance_2 = delta_x * delta_x + delta_y * delta_y;
        const distance = Math.sqrt(distance_2);

        //if (distance <= this.#max_distance) return [0, 0];

        const kof = 1e1 / this.#max_distance;
        const force = kof * (distance - this.#max_distance);

        return [
            delta_x / distance * force,
            delta_y / distance * force
        ];
    }

    #centerForce(nodes_pos, node) { 
        const [delta_x, delta_y] = this.#distanceL1(nodes_pos, "graph_center", node);
        const force = 1e1 / (this.#max_distance * 1e1);

        return [
            delta_x * force,
            delta_y * force,
        ];
    }

    #distanceL1(nodes_pos, node_1, node_2) {
        const pos_1 = nodes_pos.get(node_1);
        const pos_2 = nodes_pos.get(node_2);

        const delta_x = pos_1[0] - pos_2[0];
        const delta_y = pos_1[1] - pos_2[1];

        // Avoid having the same space position, because it would be physically impossible
        if (delta_x == 0 && delta_y == 0) {
            pos_2[0] += Math.random() * 2 - 1; //between -1 and 1
            pos_2[1] += Math.random() * 2 - 1; //between -1 and 1
        }

        return [
            pos_1[0] - pos_2[0],
            pos_1[1] - pos_2[1],
        ];
    }
    
    #capForces(node_forces) {
        const magnitude = Math.sqrt(node_forces[0] * node_forces[0] + node_forces[1] * node_forces[1]);

        if (magnitude > this.#max_distance) {
            node_forces[0] /= (magnitude * this.#max_distance);
            node_forces[1] /= (magnitude * this.#max_distance);
        } else {
            node_forces[0] *= this.#forces_dumping;
            node_forces[1] *= this.#forces_dumping;
        }
    }
}