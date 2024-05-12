export class PathFindingStrategy {
    _free;
    _obs;
    _goal;

    constructor(free_cell_symbol, obstacle_cell_symbol, goal_cell_symbol) {
        this._free = free_cell_symbol;
        this._obstacle_cell_symbol = obstacle_cell_symbol;
        this._goal = goal_cell_symbol;
    }

    explore(grid, start, goal) { return null; };
}