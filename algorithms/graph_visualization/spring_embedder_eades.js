import {
    IterableSet
} from "/dsa/iterable_set.js";

import {
    GraphVisualizationStrategy
} from "/algorithms/graph_visualization/strategy_interface.js";

// Source: https://i11www.iti.kit.edu/_media/teaching/winter2016/graphvis/graphvis-ws16-v6.pdf
export class SpringEmbedderEadesStrategy extends GraphVisualizationStrategy {
    #min_x;
    #min_y;
    #max_x;
    #max_y;

    #node_radius;
    #delta; // force multiplier
    #c_rep; // repulsive constant
    #c_spring; // spring constant
    #l_spring; // spring length
    #temp_cooldown_factor; // delta cooldown factor 

    constructor(min_x, min_y, max_x, max_y) {
        super();

        this.#node_radius = 50; //TODO, make this an input parameter

        this.#min_x = min_x;
        this.#min_y = min_y;
        this.#max_x = max_x - (2 * this.#node_radius);
        this.#max_y = max_y - (2 * this.#node_radius);

        this.#delta = 1;
        this.#c_rep = 1e0; 
        this.#c_spring = 1e1;
        this.#l_spring = 1e2;
        this.#temp_cooldown_factor = 1//0.999;
    }

    getInitialNodePositions(graph) {
        const nodes_list = new IterableSet(graph.nodes());
        const nodes_pos = new Map();

        // Try to find the optimal c_rep
        this.#c_rep = this.#c_rep * (this.#max_x - this.#min_x) * (this.#max_y - this.#min_y) / nodes_list.size(); 

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

        // Calculate the forces acting on each node
        nodes_list.forEach((node, idx) => {
            const node_nbs = graph.neighborsOf(node);
            const other_nodes = [];

            let node_pos = nodes_pos.get(node);
            let node_forces = [0, 0];
                    
            // Find nodes that are not neighbors of the current node
            nodes_list.forEach((other_node, idx) => {
                if (node == other_node) return;
                if (node_nbs.includes(other_node)) return;
                other_nodes.push(other_node);
            });

            // Calculate the attractive forces of the current node
            node_nbs.forEach((nb, idx) => {
                const forces = this.#attractiveForce(nodes_pos, nb, node);
                node_forces[0] += forces[0];
                node_forces[1] += forces[1];
            });

            // Calculate repulsive forces of the current node
            other_nodes.forEach((other_node, idx) => {
                const forces = this.#repulsiveForce(nodes_pos, node, other_node);
                node_forces[0] += forces[0];
                node_forces[1] += forces[1];
            });

            node_pos[0] = Math.min(this.#max_x, Math.max(this.#min_x, node_pos[0] + this.#delta * node_forces[0]));
            node_pos[1] = Math.min(this.#max_y, Math.max(this.#min_y, node_pos[1] + this.#delta * node_forces[1]));

            nodes_forces.set(node, node_forces);
            nodes_pos.set(node, node_pos);
        });

        this.#delta *= this.#temp_cooldown_factor;
        return nodes_pos;
    }

    #repulsiveForce(nodes_pos, node_1, node_2) {
        let [delta_x, delta_y] = this.#distanceL1(nodes_pos, node_1, node_2);
        
        const distance_2 = delta_x * delta_x + delta_y * delta_y;
        const distance = Math.sqrt(distance_2);
        const force = this.#c_rep / distance_2;

        return [
            delta_x / distance * force,
            delta_y / distance * force
        ];
    }

    #attractiveForce(nodes_pos, node_1, node_2) {
        let [delta_x, delta_y] = this.#distanceL1(nodes_pos, node_1, node_2);
        
        const distance_2 = delta_x * delta_x + delta_y * delta_y;
        const distance = Math.sqrt(distance_2);
        const force = this.#c_spring * Math.log(distance / this.#l_spring);
        
        return [
            delta_x / distance * force,
            delta_y / distance * force
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
}