import {
    MazeGenerationStrategy
} from "./maze_generation_strategy_interface.js";

export class KruskalMazeGenerationStrategy extends MazeGenerationStrategy {
    #grid;

    constructor(rows, cols, gridBuilder) {
        this.#grid = gridBuilder.build(rows, cols, this.free_cell_symbol);
    }

    generate(starting_points, goal_points, callback = () => { }) {

    };
}