export class PathFindingStrategy {
    _free_cell_symbol;
    _obstacle_cell_symbol;
    _goal_cell_symbol;
    _visited_cell_symbol;

    constructor(free_cell_symbol, obstacle_cell_symbol, goal_cell_symbol, visited_cell_symbol = 1) {
        this._free_cell_symbol = free_cell_symbol;
        this._obstacle_cell_symbol = obstacle_cell_symbol;
        this._goal_cell_symbol = goal_cell_symbol;
        this._visited_cell_symbol = visited_cell_symbol;
    }

    get free_cell_symbol() {
        return this._free_cell_symbol;
    }

    get obstacle_cell_symbol() {
        return this._obstacle_cell_symbol;
    }

    get goal_cell_symbol() {
        return this._goal_cell_symbol;
    }

    get visited_cell_symbol() {
        return this._visited_cell_symbol;
    }

    explore(grid, start, goal) { return null; };
}