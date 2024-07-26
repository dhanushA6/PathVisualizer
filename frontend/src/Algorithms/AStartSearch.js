export function aStar(grid, startNode, finishNode) {
    const visitedNodesInOrder = [];
    startNode.distance = 0;
    startNode.heuristic = calculateHeuristic(startNode, finishNode);
    const openSet = [startNode]; // This is analogous to a priority queue
  
    while (openSet.length) {
      // Sort nodes by f = g + h value (distance + heuristic)
      sortNodesByHeuristic(openSet);
  
      // Get the node with the smallest f value
      const currentNode = openSet.shift();
  
      // If we encounter a wall, skip it
      if (currentNode.isWall) continue;
  
      // If the distance is Infinity, there is no path
      if (currentNode.distance === Infinity) return visitedNodesInOrder;
  
      // Mark the node as visited
      currentNode.isVisited = true;
      visitedNodesInOrder.push(currentNode);
  
      // If the current node is the finish node, return the path
      if (currentNode === finishNode) return visitedNodesInOrder;
  
      // Update the neighbors
      updateUnvisitedNeighborsAStar(currentNode, grid, finishNode, openSet);
    }
    
    return visitedNodesInOrder;
}

function sortNodesByHeuristic(nodes) {
    nodes.sort((nodeA, nodeB) => (nodeA.distance + nodeA.heuristic) - (nodeB.distance + nodeB.heuristic));
}

function calculateHeuristic(node, finishNode) {
    // Manhattan distance (for grid-based pathfinding)
    const dx = Math.abs(node.row - finishNode.row);
    const dy = Math.abs(node.col - finishNode.col);
    return dx + dy;
}

function updateUnvisitedNeighborsAStar(node, grid, finishNode, openSet) {
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
    for (const neighbor of unvisitedNeighbors) {
        const tentativeDistance = node.distance + 1;
        if (tentativeDistance < neighbor.distance) {
            neighbor.distance = tentativeDistance;
            neighbor.heuristic = calculateHeuristic(neighbor, finishNode);
            neighbor.previousNode = node;

            if (!openSet.includes(neighbor)) {
                openSet.push(neighbor);
            }
        }
    }
}

function getUnvisitedNeighbors(node, grid) {
    const neighbors = [];
    const { col, row } = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors.filter(neighbor => !neighbor.isVisited);
}
