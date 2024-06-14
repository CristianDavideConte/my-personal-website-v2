import {
    IterableArray
} from "../../../dsa/iterable_array/iterable_array.js";

import {
    PriorityQueue
} from "../../../dsa/priority_queue.js";

import {
    UInt8MatrixBuilder
} from "../../../dsa/matrix/uint8_matrix_builder.js";

import {
    PathFindingStrategy
} from "./path_finding_strategy_interface.js";

export class DijkstraPathFindingStrategy extends PathFindingStrategy {
    explore(grid, start, goal) {
        const exploration_order = [];
        const path_retrieval_order = [];

        this.#explore_impl(grid, exploration_order, path_retrieval_order, start, goal);

        return [new IterableArray(exploration_order), new IterableArray(path_retrieval_order)];
    }

    #explore_impl(grid, exploration_order, path_retrieval_order, start, goal) {
        const costs = grid.builder?.build(grid.rows, grid.cols, Number.MAX_SAFE_INTEGER) ??
                      new UInt8MatrixBuilder().build(grid.rows, grid.cols, Number.MAX_SAFE_INTEGER); // default fallback type of cost matrix
        const q = new PriorityQueue((a, b) => this.#comparator(a, b, costs));
        const exploration_positions = [
            [-1, 0], // top
            [0, 1], // right
            [1, 0], // bottom 
            [0, -1], // left
        ];
        
        costs.set(0, 0, 0);
        q.push(start);

        while (!q.isEmpty()) {
            const curr_pos = q.top();
            const curr_cost = costs.get(curr_pos[0], curr_pos[1]);
            q.pop();

            exploration_order.push(curr_pos);

            for (const pos of exploration_positions) {
                const new_pos = this.#sumPositions(curr_pos, pos);

                if (!this.#isValidPosition(grid, new_pos)) continue;
                if (grid.get(new_pos[0], new_pos[1]) == this.obstacle_cell_symbol) continue;
                if (grid.get(new_pos[0], new_pos[1]) == this.goal_cell_symbol) {
                    // Wrong goal cell, don't use it for the path
                    if (new_pos[0] != goal[0] || new_pos[1] != goal[1]) continue;

                    // Goal reached
                    path_retrieval_order[new_pos] = curr_pos;
                    exploration_order.push(new_pos);
                    return;
                }

                const new_cost = curr_cost + 1 + this.#distanceL1(new_pos, goal);

                if (costs.get(new_pos[0], new_pos[1]) <= new_cost) continue;

                path_retrieval_order[new_pos] = curr_pos;
                costs.set(new_pos[0], new_pos[1], new_cost);
                q.push(new_pos);
            }
        }
    }

    #sumPositions(pos1, pos2) {
        return [pos1[0] + pos2[0], pos1[1] + pos2[1]];
    }

    #isValidPosition(grid, pos) {
        return pos[0] >= 0 && pos[0] < grid.rows &&
               pos[1] >= 0 && pos[1] < grid.cols;
    }

    #comparator(pos1, pos2, costs) {
        const distance_1 = costs.get(pos1[0], pos1[1]);
        const distance_2 = costs.get(pos2[0], pos2[1]);
        return distance_1 > distance_2;
    }

    #distanceL1(curr, goal) {
        return Math.abs(curr[0] - goal[0]) + Math.abs(curr[1] - goal[1]);
    }

    get comparator() {
        return {
            equal: (a, b) => a[0] === b[0] && a[1] === b[1]
        }
    }
}