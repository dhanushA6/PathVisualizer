export function bidirectionalSearch(grid, startNode, finishNode) {
    const visitedNodesInOrder = [];
    const startQueue = [startNode];
    const finishQueue = [finishNode];
    const startVisited = new Set();
    const finishVisited = new Set();
    
    startNode.distance = 0; // Distance not used but keeps structure
    finishNode.distance = 0; // Distance not used but keeps structure
    
    startVisited.add(startNode);
    finishVisited.add(finishNode);
    
    while (startQueue.length && finishQueue.length) {
        // Search from start
        const startCurrentNode = startQueue.shift();
        startCurrentNode.isVisited = true;
        visitedNodesInOrder.push(startCurrentNode);
        
        // Check if the search from start has met the search from finish
        if (finishVisited.has(startCurrentNode)) {
            return reconstructPath(startNode, startCurrentNode, finishNode, finishVisited);
        }
        
        // Update neighbors from the start side
        updateUnvisitedNeighbors(startCurrentNode, grid, startQueue, startVisited);
        
        // Search from finish
        const finishCurrentNode = finishQueue.shift();
        finishCurrentNode.isVisited = true;
        visitedNodesInOrder.push(finishCurrentNode);
        
        // Check if the search from finish has met the search from start
        if (startVisited.has(finishCurrentNode)) {
            return reconstructPath(startNode, finishNode, finishCurrentNode, startVisited);
        }
        
        // Update neighbors from the finish side
        updateUnvisitedNeighbors(finishCurrentNode, grid, finishQueue, finishVisited);
    }
    
    return visitedNodesInOrder;
}

function updateUnvisitedNeighbors(node, grid, queue, visitedSet) {
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
    for (const neighbor of unvisitedNeighbors) {
        if (!visitedSet.has(neighbor)) {
            neighbor.previousNode = node;
            visitedSet.add(neighbor);
            queue.push(neighbor);
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

function reconstructPath(startNode, meetNode, finishNode, finishVisited) {
    const path = [];
    
    // Reconstruct path from start to meeting point
    let node = meetNode;
    while (node) {
        path.push(node);
        node = node.previousNode;
    }
    
    path.reverse();
    
    // Reconstruct path from meeting point to finish
    node = finishNode;
    const pathToFinish = [];
    while (node) {
        pathToFinish.push(node);
        node = node.previousNode;
    }
    
    return path.concat(pathToFinish.slice(1)); // Avoid double counting the meeting node
}
