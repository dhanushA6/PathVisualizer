// recursiveHorizontalSkewMaze.js
export function recursiveHorizontalSkewMaze(board, top, bottom, left, right, forceHorizontal, wallType) {
    if (bottom - top <= 1 || right - left <= 1) return;
  
    const orientation = forceHorizontal ? 'horizontal' : Math.random() < 0.5 ? 'horizontal' : 'vertical';
    const isHorizontal = orientation === 'horizontal';
  
    // Calculate wall position
    const wallRow = isHorizontal ? Math.floor(Math.random() * (bottom - top - 1)) + top + 1 : bottom;
    const wallCol = isHorizontal ? right : Math.floor(Math.random() * (right - left - 1)) + left + 1;
  
    // Place the skewed wall
    for (let i = (isHorizontal ? left : top); (isHorizontal ? i <= right : i <= bottom); i++) {
      const wallX = isHorizontal ? wallRow + (i - left) : i;
      const wallY = isHorizontal ? i : wallCol + (i - top);
      const nodeId = `${wallX}-${wallY}`;
      const node = board.nodes[nodeId];
      const htmlNode = document.getElementById(`node-${wallX}-${wallY}`);
      if (node && !node.isStart && !node.isFinish && htmlNode) {
        node.isWall = true;
        board.wallsToAnimate.push(htmlNode);
      }
    }
  
    // Create passages through the skewed wall
    const passageRow = isHorizontal ? wallRow : Math.floor(Math.random() * (bottom - top)) + top;
    const passageCol = isHorizontal ? Math.floor(Math.random() * (right - left)) + left : wallCol;
  
    const passageNodeId = `${passageRow}-${passageCol}`;
    const passageNode = board.nodes[passageNodeId];
    const passageHtmlNode = document.getElementById(`node-${passageRow}-${passageCol}`);
    if (passageNode && !passageNode.isStart && !passageNode.isFinish && passageHtmlNode) {
      passageNode.isWall = false;
      board.wallsToAnimate = board.wallsToAnimate.filter(node => node !== passageHtmlNode);
    }
  
    // Recursively divide the grid into sections
    if (isHorizontal) {
      recursiveHorizontalSkewMaze(board, top, wallRow - 1, left, right, 'vertical', wallType);
      recursiveHorizontalSkewMaze(board, wallRow + 1, bottom, left, right, 'vertical', wallType);
    } else {
      recursiveHorizontalSkewMaze(board, top, bottom, left, wallCol - 1, 'horizontal', wallType);
      recursiveHorizontalSkewMaze(board, top, bottom, wallCol + 1, right, 'horizontal', wallType);
    }
  }
  
//   module.exports = recursiveHorizontalSkewMaze;
  