export function generateRandomMaze(board) {
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
    
    // Create random walls
    const wallProbability = 0.3; // Probability to place a wall, adjust as needed
    
    for (let x = 0; x < height; x++) {
      for (let y = 0; y < width; y++) {
        if (Math.random() < wallProbability) {
          setWall(x, y);
        }
      }
    }
  }
  

  