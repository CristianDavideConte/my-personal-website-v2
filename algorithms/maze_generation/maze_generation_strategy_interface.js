export class MazeGenerationStrategy {
    #free_cell_symbol;
    #obstacle_cell_symbol;
    #goal_cell_symbol;

    constructor(free_cell_symbol, obstacle_cell_symbol, goal_cell_symbol) {
        this.#free_cell_symbol = free_cell_symbol;
        this.#obstacle_cell_symbol = obstacle_cell_symbol;
        this.#goal_cell_symbol = goal_cell_symbol;
    }

    get free_cell_symbol() {
        return this.#free_cell_symbol;
    }

    get obstacle_cell_symbol() {
        return this.#obstacle_cell_symbol;
    }

    get goal_cell_symbol() {
        return this.#goal_cell_symbol;
    }

    generate() { throw new Error("Not implemented"); };
}