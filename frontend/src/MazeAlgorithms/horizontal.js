export function recursiveHorizontalMaze(board, top, bottom, left, right, orientation, forceHorizontal, wallType) {
    // Base case: stop recursion if the width or height of the area is too small
    if (bottom - top <= 1 || right - left <= 1) return;

    // Determine orientation of the wall based on the provided orientation
    if (forceHorizontal) {
        orientation = "horizontal"
    } else if (orientation === 'horizontal') {
        orientation = 'vertical';
    } else {
        orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';
    }

    // Calculate wall position
    const isHorizontal = orientation === 'horizontal';
    const wallRow = isHorizontal ? Math.floor(Math.random() * (bottom - top - 1)) + top + 1 : bottom;
    const wallCol = isHorizontal ? right : Math.floor(Math.random() * (right - left - 1)) + left + 1;

    // Place the wall
    for (let i = (isHorizontal ? left : top); (isHorizontal ? i <= right : i <= bottom); i++) {
        const wallX = isHorizontal ? wallRow : i;
        const wallY = isHorizontal ? i : wallCol;
        const nodeId = `${wallX}-${wallY}`;
        const node = board.nodes[nodeId];
        const htmlNode = document.getElementById(`node-${wallX}-${wallY}`);
        if (node && !node.isStart && !node.isFinish && htmlNode) {
            node.isWall = true;
            board.wallsToAnimate.push(htmlNode);
        }
    }

    // Create passages through the wall
    const passageRow = isHorizontal ? wallRow : Math.floor(Math.random() * (bottom - top)) + top;
    const passageCol = isHorizontal ? Math.floor(Math.random() * (right - left)) + left : wallCol;

    const passageNodeId = `${passageRow}-${passageCol}`;
    const passageNode = board.nodes[passageNodeId];
    const passageHtmlNode = document.getElementById(`node-${passageRow}-${passageCol}`);
    if (passageNode && !passageNode.isStart && !passageNode.isFinish && passageHtmlNode) {
        passageNode.isWall = false;
        board.wallsToAnimate = board.wallsToAnimate.filter(node => node !== passageHtmlNode);
    }

    // Recursively divide the grid into four sections
    if (isHorizontal) {
        recursiveHorizontalMaze(board, top, wallRow - 1, left, right, 'horizontal', true, wallType);
        recursiveHorizontalMaze(board, wallRow + 1, bottom, left, right, 'horizontal', true, wallType);
    } else {
        recursiveHorizontalMaze(board, top, bottom, left, wallCol - 1, 'horizontal', true, wallType);
        recursiveHorizontalMaze(board, top, bottom, wallCol + 1, right, 'horizontal', true, wallType);
    }
}
