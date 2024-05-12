import { PathFindingStrategy } from "./strategy_interface";

class DijkstraPathFindingStrategy extends PathFindingStrategy {
    explore(grid, start, goal) {
        
    }

    #exploreImpl() {
        
    }

    #distanceL1(curr, goal) {
        return Math.abs(curr[0] - goal[0]) + Math.abs(curr[1] - goal[1]);
    }
}