import {
    IterableArray
} from "../../dsa/iterable_array/iterable_array.js";

import {
    MazeGenerationStrategy
} from "./maze_generation_strategy_interface.js";

export class KruskalMazeGenerationStrategy extends MazeGenerationStrategy {
    #grid;
    #disjoint_set;

    constructor(
        free_cell_symbol, obstacle_cell_symbol, goal_cell_symbol,
        rows, cols, grid_builder, matrix_disjoint_set_builder
    ) {
        super(free_cell_symbol, obstacle_cell_symbol, goal_cell_symbol); 

        this.#grid = grid_builder.build(rows, cols, this.obstacle_cell_symbol);
        this.#disjoint_set = matrix_disjoint_set_builder.build(rows, cols);
    }

    generate(starting_points, goal_points, callback = () => { }) {
        const cells_queue = new IterableArray();
        let maze_completed = false;

        this.#grid.forEach((el, idx) => {
            const [i, j] = this.#grid.from_idx_to_ij(idx);

            // up path
            if (i - 1 >= 0) {
                cells_queue.push([[i, j], [i - 1, j]]);
            }

            // left path
            if (j - 1 >= 0) {
                cells_queue.push([[i, j], [i, j - 1]]);
            }
        });

        cells_queue.shuffle();

        cells_queue.forEach((el, idx) => {
            if (maze_completed) return;
            
            const [curr_cell_1, curr_cell_2] = el;

            if (
                !this.#disjoint_set.union(
                    curr_cell_1[0], curr_cell_1[1],
                    curr_cell_2[0], curr_cell_2[1]
                )
            ) {
                return;
            }

            this.#grid.set(curr_cell_1[0], curr_cell_1[1], this.free_cell_symbol);
            this.#grid.set(curr_cell_2[0], curr_cell_2[1], this.free_cell_symbol);

            callback(this.#grid, curr_cell_1, curr_cell_2);

            maze_completed = true;

            // check if all starting points are connected to all the goal points
            starting_points.forEach((start, idx) => {
                if (!maze_completed) return;

                goal_points.forEach((goal, idx) => {
                    if (!maze_completed) return;

                    const parent_1 = this.#disjoint_set.find(start[0], start[1]);
                    const parent_2 = this.#disjoint_set.find(goal[0], goal[1]);

                    if (parent_1 !== parent_2) {
                        maze_completed = false;
                    }
                });
            });
        });

        //starting_points.forEach((point) => this.#grid.set(point[0], point[1], this.free_cell_symbol));
        goal_points.forEach((point) => this.#grid.set(point[0], point[1], this.goal_cell_symbol));

        return this.#grid;
    };

    get disjoint_set() {
        return this.#disjoint_set;
    }
}