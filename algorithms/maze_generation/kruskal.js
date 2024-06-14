import {
    MazeGenerationStrategy
} from "./maze_generation_strategy_interface.js";

export class KruskalMazeGenerationStrategy extends MazeGenerationStrategy {
    #grid;
    #disjoint_set;

    constructor(rows, cols, grid_builder, matrix_disjoint_set_builder) {
        super(0, 1, 2, 3); 

        this.#grid = grid_builder.build(rows, cols, this.free_cell_symbol);
        this.#disjoint_set = matrix_disjoint_set_builder.build(rows, cols);
    }

    generate(starting_points, goal_points, callback = () => { }) {

    };

    get disjoint_set() {
        return this.#disjoint_set;
    }
}