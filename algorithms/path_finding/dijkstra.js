import {
    PriorityQueue
} from "../../dsa/priority_queue.js";

import {
    UInt8MatrixBuilder
} from "../../dsa/matrix/uint8_matrix_builder.js";

import {
    PathFindingStrategy
} from "./strategy_interface.js";

export class DijkstraPathFindingStrategy extends PathFindingStrategy {
    explore(grid, start, goal) {
        const exploration_order = [];

        this.#explore_impl(grid, exploration_order, start, goal);

        return exploration_order;
    }

    #explore_impl(grid, exploration_order, start, goal) {
        const q = new PriorityQueue((a, b) => this.#comparator(a, b, start, goal));
        const seen = new UInt8MatrixBuilder().build(grid.rows, grid.cols);
        const exploration_positions = [
            [-1, 0], // top
            [0, 1], // right
            [1, 0], // bottom 
            [0, -1], // left
        ];
        
        q.push(start);

        while (!q.isEmpty()) {
            const curr_pos = q.top();
            q.pop();

            exploration_order.push(curr_pos);
            seen.set(curr_pos[0], curr_pos[1], this.visited_cell_symbol);

            for (const pos of exploration_positions) {
                const new_pos = this.#sumPositions(curr_pos, pos);

                if (!this.#isValidPosition(grid, new_pos)) continue;
                if (seen.get(new_pos[0], new_pos[1]) == this.visited_cell_symbol) continue;
                if (grid.get(new_pos[0], new_pos[1]) == this.obstacle_cell_symbol) continue;
                if (grid.get(new_pos[0], new_pos[1]) == this.goal_cell_symbol) {
                    // Goal reached
                    if (new_pos[0] != goal[0] || new_pos[1] != goal[1]) continue;
                    exploration_order.push(new_pos);
                    return;
                }

                q.push(new_pos);
            }
        }
    } //TODO: this is not dijkstra yet, use a cost matrix instead of a visited matrix + add path retrieval to ALL EXPLORATION STRATEGIES

    #sumPositions(pos1, pos2) {
        return [pos1[0] + pos2[0], pos1[1] + pos2[1]];
    }

    #isValidPosition(grid, pos) {
        return pos[0] >= 0 && pos[0] < grid.rows &&
               pos[1] >= 0 && pos[1] < grid.cols;
    }

    #comparator(pos1, pos2, start, goal) {
        const distance_1 = this.#distanceL1(pos1, start) + this.#distanceL1(pos1, goal);
        const distance_2 = this.#distanceL1(pos2, start) + this.#distanceL1(pos2, goal);

        return distance_1 > distance_2;
    }

    #distanceL1(curr, goal) {
        return Math.abs(curr[0] - goal[0]) + Math.abs(curr[1] - goal[1]);
    }
}