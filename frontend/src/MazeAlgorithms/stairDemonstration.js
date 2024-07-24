export function stairDemonstration(board) {
    const height = board.height;
    const width = board.width;
  
    // Function to set a node as a wall if it is valid
    const setWall = (x, y) => {
      const nodeId = `${x}-${y}`;
      const node = board.nodes[nodeId];
      const htmlNode = document.getElementById(`node-${x}-${y}`);
      if (node && !node.isStart && !node.isFinish && htmlNode) {
        node.isWall = true;
        board.wallsToAnimate.push(htmlNode);
      }
    };
  
    // Create the up-and-down staircase shape
    let x = height - 1;
    let y = 0;
  
    // First downward diagonal
    while (x > 1 && y < width / 2) {
      setWall(x, y);
      x--;
      y++;
    }
  
    // Second upward diagonal
    while (x < height - 2 && y < width-1) {
      setWall(x, y);
      x++;
      y++;
    }
  
    // Third downward diagonal
    while (x > 1 && y < width-1) {
      setWall(x, y);
      x--;
      y++;
    }
  }
 
  