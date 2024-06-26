import {
    IterableSet
} from "../../dsa/iterable_set.js";

import {
    GraphVisualizationStrategy
} from "./graph_visualization_strategy_interface.js";

// Source: https://i11www.iti.kit.edu/_media/teaching/winter2016/graphvis/graphvis-ws16-v6.pdf
export class SpringEmbedderEadesStrategy extends GraphVisualizationStrategy {
    #min_x;
    #min_y;
    #max_x;
    #max_y;

    #node_diameter;
    #delta; // force multiplier
    #c_rep; // repulsive constant
    #c_spring; // spring constant
    #l_spring; // spring length
    #temp_cooldown_factor; // delta cooldown factor 

    constructor(min_x, min_y, max_x, max_y, node_diameter) {
        super();

        this.#node_diameter = node_diameter; // In px

        this.#min_x = min_x;
        this.#min_y = min_y;
        this.#max_x = max_x - this.#node_diameter;
        this.#max_y = max_y - this.#node_diameter;

        this.#delta = 1;
        this.#c_rep = 3e0; 
        this.#c_spring = 1e1;
        this.#l_spring = 2e2;
        this.#temp_cooldown_factor = 1//0.99;
    }

    getInitialNodePositions(graph) {
        const nodes_list = new IterableSet(graph.nodes());
        const nodes_pos = new Map();

        // Try to find the optimal c_rep
        this.#c_rep = this.#c_rep * (this.#max_x - this.#min_x) * (this.#max_y - this.#min_y) / nodes_list.size(); 

        let prev_x = (this.#max_x + this.#min_x) / 2;
        let prev_y = (this.#max_y + this.#min_y) / 2;

        nodes_list.forEach((node, idx) => {
            const new_x = Math.min(this.#max_x, Math.max(this.#min_x, prev_x + (Math.random() * 2 - 1) * this.#node_diameter));
            const new_y = Math.min(this.#max_y, Math.max(this.#min_y, prev_y + (Math.random() * 2 - 1) * this.#node_diameter));

            prev_x = new_x;
            prev_y = new_y;

            nodes_pos.set(node, [new_x, new_y]);
        });

        return nodes_pos;
    }

    updatePlacement(graph, initial_poses) {
        let nodes_list = Array.from(graph.nodes()); //new IterableSet();

        const nodes_pos = initial_poses;

        // Calculate the forces acting on each node
        nodes_list.forEach((node, idx) => {
            const node_nbs = graph.neighborsOf(node);
            let node_pos = nodes_pos.get(node);
            let node_forces = [0, 0];
                    
            // Calculate the attractive forces of the current node
            node_nbs.forEach((nb, idx) => {
                const forces = this.#attractiveForce(nodes_pos, nb, node);
                node_forces[0] += forces[0];
                node_forces[1] += forces[1];
            });

            // Calculate repulsive forces of the current node
            nodes_list.forEach((other_node, idx) => {
                if (node == other_node) return;
                if (node_nbs.includes(other_node)) return; //TODO: try to comment this out

                const forces = this.#repulsiveForce(nodes_pos, node, other_node);
                node_forces[0] += forces[0];
                node_forces[1] += forces[1];
            });

            node_pos[0] = Math.min(this.#max_x, Math.max(this.#min_x, node_pos[0] + this.#delta * node_forces[0]));
            node_pos[1] = Math.min(this.#max_y, Math.max(this.#min_y, node_pos[1] + this.#delta * node_forces[1]));
            
            // Only use integer positions
            {
                node_pos[0] = Math.trunc(node_pos[0]);
                node_pos[1] = Math.trunc(node_pos[1]);
            }

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