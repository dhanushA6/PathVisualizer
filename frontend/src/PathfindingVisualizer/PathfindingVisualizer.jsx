import React, { Component } from "react";
import Node from "../components/Node/Node";
import { dijkstra, getNodesInShortestPathOrder } from "../Algorithms/dijkstra";
import {
  breadthFirstSearch,
  depthFirstSearch,
} from "../Algorithms/unweightedSearchAlgorithm"; // Assuming you have these
import "./PathfindingVisualizer.css";
import { recursiveDivisionMaze } from "../MazeAlgorithms/recursiveDivisionMaze";
import { stairDemonstration } from "../MazeAlgorithms/stairDemonstration";
import { generateRandomMaze } from "../MazeAlgorithms/generateRandomMaze";

const INITIAL_START_NODE_ROW = 10;
const INITIAL_START_NODE_COL = 3;
const INITIAL_FINISH_NODE_ROW = 10;
const INITIAL_FINISH_NODE_COL = 40;

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      selectedAlgorithm: "dijkstra", // Default algorithm
      draggingNode: null, // new state to track the dragged node
      startNode: { row: INITIAL_START_NODE_ROW, col: INITIAL_START_NODE_COL },
      finishNode: {
        row: INITIAL_FINISH_NODE_ROW,
        col: INITIAL_FINISH_NODE_COL,
      },
      selectedMazeType: "recursiveDivision",
      loading: false,
      animationSpeed: 10,
    };
  }

  setLoading = (value) => {
    this.setState({ loading: value });
    console.log("Value: ", value);
  };

  componentDidMount() {
    const grid = getInitialGrid(this.state.startNode, this.state.finishNode);
    this.setState({ grid });
  }

  handleAnimationSpeedChange = (event) => {
    if (this.state.loading) return;
    this.setState({ animationSpeed: Number(event.target.value) });
  };

  handleMouseDown(row, col) {
    if (this.state.loading) return;

    const node = this.state.grid[row][col];
    if (node.isVisited) {
      document.getElementById("info-text").innerHTML =
        "Clear Board to Move Start and  End ";
      setTimeout(function () {
        document.getElementById("info-text").innerHTML = "";
      }, 3000);
    }
    if (node.isStart && !node.isVisited) {
      this.setState({ draggingNode: "start", mouseIsPressed: true });
    } else if (node.isFinish && !node.isVisited) {
      this.setState({ draggingNode: "finish", mouseIsPressed: true });
    } else if (!node.isVisited && !node.isStart && !node.isFinish) {
      // console.log("test")
      const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
      this.setState({ grid: newGrid, mouseIsPressed: true });
    }
  }

  handleMouseEnter(row, col) {
    if (this.state.loading) return;
    if (!this.state.mouseIsPressed) return;

    if (this.state.draggingNode) {
      const { draggingNode, startNode, finishNode } = this.state;

      // Check if the new position conflicts with the other node
      if (draggingNode === "start") {
        if (row === finishNode.row && col === finishNode.col) {
          return; // Prevent moving start to the same row or column as finish
        }
      } else if (draggingNode === "finish") {
        if (row === startNode.row && col === startNode.col) {
          return; // Prevent moving finish to the same row or column as start
        }
      }
      // console.log(this.state.grid[row][col].isWall)
      if (this.state.grid[row][col].isWall) return;

      const newGrid = getNewGridWithNodeMoved(
        this.state.grid,
        row,
        col,
        draggingNode
      );
      if (draggingNode === "start") {
        this.setState({ grid: newGrid, startNode: { row, col } });
      } else if (draggingNode === "finish") {
        this.setState({ grid: newGrid, finishNode: { row, col } });
      }
    } else {
      const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
      this.setState({ grid: newGrid });
    }
  }

  handleMouseUp() {
    if (this.state.loading) return;
    this.setState({ mouseIsPressed: false, draggingNode: null });
  }

  animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder) {
    const { animationSpeed } = this.state;
    return new Promise((resolve) => {
      for (let i = 0; i <= visitedNodesInOrder.length; i++) {
        if (i === visitedNodesInOrder.length) {
          setTimeout(() => {
            this.animateShortestPath(nodesInShortestPathOrder).then(resolve);
          }, animationSpeed * i);
          return;
        }
        setTimeout(() => {
          const node = visitedNodesInOrder[i];
          if (!node.isStart && !node.isFinish) {
            document.getElementById(`node-${node.row}-${node.col}`).className =
              "node node-visited"; 
          }
        }, animationSpeed * i); 
        
      }
    });
  }

  animateShortestPath(nodesInShortestPathOrder) {
    const { animationSpeed } = this.state;
    return new Promise((resolve) => {
      for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
        setTimeout(() => {
          const node = nodesInShortestPathOrder[i];
          if (!node.isStart && !node.isFinish) {
            document.getElementById(`node-${node.row}-${node.col}`).className =
              "node node-shortest-path";
          }
          if (i === nodesInShortestPathOrder.length - 1) resolve();
        }, animationSpeed * i);
      }
    });
  }

  visualizeAlgorithm = async () => {
    console.log(this.state.finishNode.row, this.state.finishNode.col);
    if (this.state.loading) return;
    await this.clearPathNodes();
    this.setLoading(true);
    const { grid, selectedAlgorithm, startNode, finishNode } = this.state;
    const start = grid[startNode.row][startNode.col];
    const finish = grid[finishNode.row][finishNode.col];

    let visitedNodesInOrder, nodesInShortestPathOrder;

    switch (selectedAlgorithm) {
      case "dijkstra":
        visitedNodesInOrder = dijkstra(grid, start, finish);
        nodesInShortestPathOrder = getNodesInShortestPathOrder(finish);
        break;
      case "dfs":
        visitedNodesInOrder = depthFirstSearch(grid, start, finish);
        nodesInShortestPathOrder = getNodesInShortestPathOrder(finish); // Adjust if needed
        break;
      case "bfs":
        visitedNodesInOrder = breadthFirstSearch(grid, start, finish);
        nodesInShortestPathOrder = getNodesInShortestPathOrder(finish); // Adjust if needed
        break;
      default:
        return;
    }

    await this.animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
    this.setLoading(false);
  };

  generateMaze = async () => {
    if (this.state.loading) return;
    this.setLoading(true);
    await this.clearWalls(); // Wait for clearWalls to complete
    const { grid, selectedMazeType } = this.state;
    const board = {
      nodes: {},
      height: grid.length,
      width: grid[0].length,
      wallsToAnimate: [],
      start: `${this.state.startNode.row}-${this.state.startNode.col}`,
      target: `${this.state.finishNode.row}-${this.state.finishNode.col}`,
      object: null,
    };

    // Initialize board.nodes
    grid.forEach((row) => {
      row.forEach((node) => {
        board.nodes[`${node.row}-${node.col}`] = node;
      });
    });

    switch (selectedMazeType) {
      case "recursiveDivision":
        recursiveDivisionMaze(
          board,
          0,
          board.height - 1,
          0,
          board.width - 1,
          "horizontal",
          false,
          "wall"
        );
        break;
      case "stair":
        stairDemonstration(board);
        break;
      case "random":
        generateRandomMaze(board);
        break;
      default:
        break;
    }

    await this.animateMazeGeneration(board);
    this.setState({ grid: this.getUpdatedGridWithWalls(board.nodes) });
    this.setLoading(false);
  };

  getUpdatedGridWithWalls = (nodes) => {
    const newGrid = this.state.grid.slice();
    for (let key in nodes) {
      const [row, col] = key.split("-").map(Number);
      if (nodes[key].status === "wall") {
        newGrid[row][col].isWall = true;
      }
    }
    return newGrid;
  };

  animateMazeGeneration = (board) => {
    return new Promise((resolve) => {
      board.wallsToAnimate.forEach((node, index) => {
        setTimeout(() => {
          if (node) {
            node.className = "node node-wall"; // Ensure this class exists in your CSS
          } else {
            console.error(`Node element at index ${index} is not found`);
          }
          if (index === board.wallsToAnimate.length - 1) {
            resolve();
          }
        }, 10 * index);
      });
    });
  };

  handleAlgorithmChange = (event) => {
    this.setState({ selectedAlgorithm: event.target.value });
  };

  handleMazeTypeChange = (event) => {
    this.setState({ selectedMazeType: event.target.value });
  };

  clearWalls = async () => {
    const { grid } = this.state;
    const newGrid = grid.map((row) =>
      row.map((node) => {
        if (!node.isStart) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node";
        }
        if (node.isFinish) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-finish";
        }
        return {
          ...node,
          isWall: false,
        };
      })
    );
    return new Promise((resolve) => {
      this.setState({ grid: newGrid }, resolve);
    });
  };

  clearPathNodes = () => {
    if (this.state.loading) return;
    const { grid } = this.state;
    const newGrid = grid.map((row) =>
      row.map((node) => {
        if (!node.isStart) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node";
        }
        if (node.isFinish) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-finish";
        }
        if (node.isStart) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-start";
        }

        if (node.isWall && !node.isStart &&!node.isFinish) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-wall";
        }
        return {
          ...node,
          isVisited: false,
          isShortestPath: false,
          distance: Infinity,
          previousNode: null,
        };
      })
    );
    return new Promise((resolve) => {
      this.setState({ grid: newGrid }, () => {
        // Set loading state to false after clearing
        resolve();
      });
    });
  };

  clearWallsAndPathNodes = () => {
    if (this.state.loading) return;
    const { grid } = this.state;
    const newGrid = grid.map((row) =>
      row.map((node) => {
        if (!node.isStart) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node";
        }
        if (node.isFinish) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-finish";
        }
        if (node.isStart) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-start";
        }
        


        return {
          ...node,
          isWall: false,
          isVisited: false,
          isShortestPath: false,
          distance: Infinity,
          previousNode: null,
        };
      })
    );

    return new Promise((resolve) => {
      this.setState({ grid: newGrid }, resolve);
    });
  };

  render() {
    const {
      grid,
      mouseIsPressed,
      selectedAlgorithm,
      selectedMazeType,
      animationSpeed,
      loading,
    } = this.state;

    return (
      <div className="box">
        <div className="navbar">
          <div className="title">Pathfinding Visualizer</div>
          <button disabled={loading} onClick={() => this.visualizeAlgorithm()}>
            Visualize{" "}
            {selectedAlgorithm.charAt(0).toUpperCase() +
              selectedAlgorithm.slice(1)}
          </button> 
          <select
            disabled={loading}
            value={selectedAlgorithm}
            onChange={this.handleAlgorithmChange}
          >
            <option value="dijkstra">Dijkstra's Algorithm</option>
            <option value="dfs">Depth-First Search</option>
            <option value="bfs">Breadth-First Search</option>
          </select>

          <button disabled={loading} onClick={() => this.generateMaze()}>
            Generate {selectedMazeType} Maze
          </button> 
          <select
            disabled={loading}
            value={selectedMazeType}
            onChange={this.handleMazeTypeChange}
          >
            <option value="recursiveDivision">Recursive Division</option>
            <option value="stair">Stair Demonstration</option>
            <option value="random">Random Maze</option>
          </select> 

          <button
            id="clear"
            disabled={loading}
            onClick={this.clearWallsAndPathNodes}
          >
            Clear Board
          </button> 

          
    
          <label>
            Animation delay: {animationSpeed} ms
            <input
              disabled={loading}
              type="range"
              min="5"
              max="150"
              value={animationSpeed}
              onChange={this.handleAnimationSpeedChange}
            />
          </label>
        </div>
        <div className="info">
         
          <div className="node-info">
            <div className="start-node"></div>Start 
            <div className="target-node"></div>End 
            <div className="wall-node"></div>Wall 
          </div>
          <div id="info-text"></div>
          {this.state.loading && (
            <div className="loading-spinner"> Processing ... </div>
          )}
        </div>

        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const { row, col, isFinish, isStart, isWall } = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={() => this.handleMouseDown(row, col)}
                      onMouseEnter={() => this.handleMouseEnter(row, col)}
                      onMouseUp={() => this.handleMouseUp()}
                      row={row}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

const getInitialGrid = (startNode, finishNode) => {
  const grid = [];
  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      currentRow.push(createNode(col, row, startNode, finishNode));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row, startNode, finishNode) => {
  return {
    col,
    row,
    isStart: row === startNode.row && col === startNode.col,
    isFinish: row === finishNode.row && col === finishNode.col,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

const getNewGridWithNodeMoved = (grid, row, col, nodeType) => {
  const newGrid = grid.slice();
  for (let r = 0; r < newGrid.length; r++) {
    for (let c = 0; c < newGrid[r].length; c++) {
      if (nodeType === "start" && newGrid[r][c].isStart) {
        newGrid[r][c] = { ...newGrid[r][c], isStart: false };
      } else if (nodeType === "finish" && newGrid[r][c].isFinish) {
        newGrid[r][c] = { ...newGrid[r][c], isFinish: false };
      }
    }
  }
  newGrid[row][col] = {
    ...newGrid[row][col],
    isStart: nodeType === "start",
    isFinish: nodeType === "finish",
  };
  return newGrid;
};
