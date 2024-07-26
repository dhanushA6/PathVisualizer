// recursiveVerticalSkewMaze.js
export function recursiveVerticalSkewMaze(board, top, bottom, left, right, forceVertical, wallType) {
    if (bottom - top <= 1 || right - left <= 1) return;
  
    const orientation = forceVertical ? 'vertical' : Math.random() < 0.5 ? 'horizontal' : 'vertical';
    const isVertical = orientation === 'vertical';
  
    // Calculate wall position
    const wallRow = isVertical ? bottom : Math.floor(Math.random() * (bottom - top - 1)) + top + 1;
    const wallCol = isVertical ? Math.floor(Math.random() * (right - left - 1)) + left + 1 : right;
  
    // Place the skewed wall
    for (let i = (isVertical ? top : left); (isVertical ? i <= bottom : i <= right); i++) {
      const wallX = isVertical ? i : wallRow + (i - top);
      const wallY = isVertical ? wallCol + (i - left) : i;
      const nodeId = `${wallX}-${wallY}`;
      const node = board.nodes[nodeId];
      const htmlNode = document.getElementById(`node-${wallX}-${wallY}`);
      if (node && !node.isStart && !node.isFinish && htmlNode) {
        node.isWall = true;
        board.wallsToAnimate.push(htmlNode);
      }
    }
  
    // Create passages through the skewed wall
    const passageRow = isVertical ? Math.floor(Math.random() * (bottom - top)) + top : wallRow;
    const passageCol = isVertical ? wallCol : Math.floor(Math.random() * (right - left)) + left;
  
    const passageNodeId = `${passageRow}-${passageCol}`;
    const passageNode = board.nodes[passageNodeId];
    const passageHtmlNode = document.getElementById(`node-${passageRow}-${passageCol}`);
    if (passageNode && !passageNode.isStart && !passageNode.isFinish && passageHtmlNode) {
      passageNode.isWall = false;
      board.wallsToAnimate = board.wallsToAnimate.filter(node => node !== passageHtmlNode);
    }
  
    // Recursively divide the grid into sections
    if (isVertical) {
      recursiveVerticalSkewMaze(board, top, bottom, left, wallCol - 1, 'horizontal', wallType);
      recursiveVerticalSkewMaze(board, top, bottom, wallCol + 1, right, 'horizontal', wallType);
    } else {
      recursiveVerticalSkewMaze(board, top, wallRow - 1, left, right, 'vertical', wallType);
      recursiveVerticalSkewMaze(board, wallRow + 1, bottom, left, right, 'vertical', wallType);
    }
  }
  
//   module.exports = recursiveVerticalSkewMaze;
  