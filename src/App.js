import React, { Component } from "react";
import Grid from "./component/grid";
import Navbar from "./component/navbar";
import NodeDetails from "./component/nodeDetails";
import { dijkstra } from "./algorithm/dijkstra";
import { DepthFirstSearch } from "./algorithm/dfs";
import { breadthFirstSearch } from "./algorithm/bfs";
import { aStar } from "./algorithm/aStar";
import { greedy } from "./algorithm/greedy";
import { getVisitedNodesInOrder } from "./algorithm/common/visitedNodesInOrder";
import { getRecursiveDivisionNodes } from "./maze/recursiveDivision";
import { getGridWithWalls } from "./maze/recursiveBacktracking";
import { getRecursiveBacktracking } from "./maze/recursiveBacktracking";
import { getStairMaze } from "./maze/stair";
import { getRandom } from "./maze/random";
import { getGrid, getGridWithToggledNode } from "./utils/grid";
import { getGridWithToggleStartNode } from "./utils/startNode";

class App extends Component {
  state = {
    grid: [],
    currNode: {},
    prevNode: {},
    start: { row: 10, col: 5 },
    end: { row: 10, col: 43 },
  };

  speed = 10;

  grid = {
    rows: 20,
    cols: 52,
  };

  componentDidMount() {
    const { start, end } = this.state;
    const grid = getGrid(this.grid, start, end);
    this.setState({ grid });
  }

  handleOnAlgoSelect = (e) => {
    const item = e.target.outerText;
    if (this.state.visualizing) return;
    this.setState({ Algo: item });
  };

  handleOnMazeSelect = (e) => {
    const maze = e.target.outerText;
    if (this.state.visualizing) return;
    this.setState({ Maze: maze });
    if (maze === "Recursive Backtracking") {
      this.visualizeRecursiveBacktracking();
      return;
    }
    this.visualizeMaze();
  };

  setNewStartNode = (node) => {
    const { grid } = this.state;
    const newGrid = grid.slice();

    this.state.prevNode = { ...this.state.currNode };
    this.state.currNode = { ...node };
    this.state.prevNode.start = false;
    this.state.currNode.start = true;

    newGrid[this.state.currNode.row][this.state.currNode.col] = {
      ...this.state.currNode,
    };
    newGrid[this.state.prevNode.row][this.state.prevNode.col] = {
      ...this.state.prevNode,
    };

    this.setState({ grid: newGrid });
  };

  setNewFinishNode = (node) => {
    const newGrid = this.state.grid.slice();

    this.state.prevNode = { ...this.state.currNode };
    this.state.currNode = { ...node };

    this.state.prevNode.finish = false;
    this.state.currNode.finish = true;

    newGrid[this.state.prevNode.row][this.state.prevNode.col] =
      this.state.prevNode;
    newGrid[this.state.currNode.row][this.state.currNode.col] =
      this.state.currNode;

    this.setState({ grid: newGrid });
  };

  handleMouseDown = (node) => {
    const { visualizing, grid, isStartNode } = this.state;
    let newGrid;
    if (!visualizing) {
      if (node.start) {
        this.setState({ isStartNode: true });
        this.state.currNode = node;
        this.state.currNode = { ...node };
        newGrid = getGridWithToggleStartNode(grid, node, isStartNode);
      } else if (node.finish) {
        this.setState({ isFinishNode: true });
        this.state.currNode = { ...node };
        newGrid = getGridWithToggleStartNode(grid, node, isStartNode);
      } else {
        newGrid = getGridWithToggledNode(grid, node);
      }
      this.setState({ grid: newGrid, isMousePressed: true });
    }
  };

  handleMouseEnter = (node) => {
    const { visualizing, isMousePressed, grid } = this.state;
    const { isStartNode, isFinishNode, running } = this.state;

    if (!visualizing && isMousePressed) {
      if (isStartNode) {
        this.resetNodes();
        this.setNewStartNode(node);
        if (running) this.instantVisualize();
      } else if (isFinishNode) {
        this.resetNodes();
        this.setNewFinishNode(node);
        if (running) this.instantVisualize();
      } else {
        const newGrid = getGridWithToggledNode(grid, node);
        this.setState({ grid: newGrid });
      }
    }
  };

  handleMouseUp = (node) => {
    if (!this.state.visualizing) {
      if (this.state.isStartNode) node.start = true;
      if (this.state.isFinishNode) node.finish = true;

      this.setState({
        isMousePressed: false,
        isStartNode: false,
        isFinishNode: false,
      });
    }
  };

  resetGrid = () => {
    this.setState({ running: false });

    const { start, end } = this.state;
    const grid = getGrid(this.grid, start, end);
    this.setState({ grid });
  };

  resetNodes = (all = 0) => {
    const { grid } = this.state;
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        const node = grid[row][col];
        const newNode = {
          ...node,
          visited: false,
          path: false,
          instantVisited: false,
          instantPath: false,
        };
        if (all) {
          newNode.animateWall = false;
          newNode.wall = false;
        }
        grid[row][col] = newNode;
      }
    }

    this.setState({ grid });
  };

  instantVisualizeShortestPath = (visitedNodesInShortestPath) => {
    const { grid } = this.state;

    for (let index = 0; index < visitedNodesInShortestPath.length; index++) {
      const node = visitedNodesInShortestPath[index];
      const { row, col } = node;
      const newNode = {
        ...node,
        instantPath: true,
        path: false,
        visited: false,
        instantVisited: false,
      };
      grid[row][col] = newNode;
      this.setState({ grid });
    }
  };

  instantVisualizeVisitedNodes = (visitedNodes, visitedNodesInShortestPath) => {
    const { grid } = this.state;
    for (let index = 0; index < visitedNodes.length; index++) {
      if (index === visitedNodes.length - 1) {
        this.instantVisualizeShortestPath(visitedNodesInShortestPath);
        return;
      }

      const node = visitedNodes[index];
      const { row, col } = node;
      const newNode = { ...node, visited: false, instantVisited: true };
      grid[row][col] = newNode;
      this.setState({ grid });
    }
  };

  instantVisualize = () => {
    const startNode = this.getStartNode();
    const finishNode = this.getFinishNode();

    this.resetNodes();

    const visitedNodes = this.getVisitedNodes(startNode, finishNode);
    let visitedNodesInShortestPath = [];

    let lastNode = visitedNodes[visitedNodes.length - 1];
    console.log(visitedNodes);
    if (lastNode.finish) {
      visitedNodesInShortestPath = getVisitedNodesInOrder(lastNode);
    }
    this.instantVisualizeVisitedNodes(visitedNodes, visitedNodesInShortestPath);
  };

  animateShortestPath = (visitedNodesInShortestPath) => {
    const { grid } = this.state;

    for (let index = 0; index < visitedNodesInShortestPath.length; index++) {
      const node = visitedNodesInShortestPath[index];
      const { row, col } = node;
      const newNode = { ...node, path: true };
      setTimeout(() => {
        grid[row][col] = newNode;
        this.setState({ grid });
      }, index * 75);
    }

    this.setState({ running: true, visualizing: false });
  };

  animateVisitedNodes = (visitedNodes, visitedNodesInShortestPath) => {
    const { grid } = this.state;
    for (let index = 1; index < visitedNodes.length; index++) {
      if (index === visitedNodes.length - 1) {
        setTimeout(() => {
          this.animateShortestPath(visitedNodesInShortestPath);
        }, index * 25);
        return;
      }

      const node = visitedNodes[index];
      const { row, col } = node;
      const newNode = { ...node, visited: true };
      setTimeout(() => {
        grid[row][col] = newNode;
        this.setState({ grid });
      }, index * 25);
    }
  };

  visualize = () => {
    const { Algo: algo, running } = this.state;

    if (!algo) return;

    if (running) {
      this.resetNodes();
    }

    const startNode = this.getStartNode();
    const finishNode = this.getFinishNode();

    this.setState({ visualizing: true });

    const visitedNodes = this.getVisitedNodes(startNode, finishNode);

    if (!visitedNodes || !visitedNodes.length) {
      this.setState({ visualizing: false });
      return;
    }

    let visitedNodesInShortestPath = [];
    let lastNode = visitedNodes[visitedNodes.length - 1];

    if (lastNode.finish) {
      visitedNodesInShortestPath = getVisitedNodesInOrder(lastNode);
    }
    this.animateVisitedNodes(visitedNodes, visitedNodesInShortestPath);
  };

  animateRecursiveBacktracking = (walls) => {
    const { grid } = this.state;

    for (let i = 0; i < walls.length; i++) {
      const node = walls[i];
      const { row, col } = node;
      const newNode = { ...node, wall: false, animateWall: false };
      setTimeout(() => {
        grid[row][col] = newNode;
        this.setState({ grid });
      }, i);
    }

    setTimeout(() => {
      this.setState({ visualizing: false });
    }, walls.length);
  };

  visualizeRecursiveBacktracking = () => {
    const { grid } = this.state;

    this.resetNodes(1);

    this.setState({ visualizing: true });

    setTimeout(() => {
      const newGrid = getGridWithWalls(grid);
      this.setState({ grid: newGrid });

      const walls = getRecursiveBacktracking(grid);
      this.animateRecursiveBacktracking(walls);
    }, this.speed);
  };

  animateMaze = (walls) => {
    const { grid } = this.state;

    setTimeout(() => {
      for (let i = 0; i < walls.length; i++) {
        const node = walls[i];
        const { row, col } = node;
        const newNode = { ...node, wall: false, animateWall: true };
        setTimeout(() => {
          grid[row][col] = newNode;
          this.setState({ grid, visualizing: true });
        }, i);
      }
    }, this.speed);

    setTimeout(() => {
      this.setState({ visualizing: false });
    }, walls.length * this.speed);
  };

  visualizeMaze = () => {
    this.resetNodes(1);

    if (this.state.visualizing) return;

    this.setState({ visualizing: true });
    console.log("visualize", this.state.visualizing);

    setTimeout(() => {
      const walls = this.getWallNodes();
      this.animateMaze(walls);
    }, this.speed);
  };

  getVisitedNodes = (startNode, finishNode) => {
    const { grid, Algo: algo } = this.state;
    let visitedNodes = [];

    switch (algo) {
      case "Dijkstra Algorithm":
        visitedNodes = dijkstra(grid, startNode);
        break;
      case "Breadth First Search":
        visitedNodes = breadthFirstSearch(grid, startNode);
        break;
      case "Depth First Search":
        visitedNodes = DepthFirstSearch(grid, startNode);
        break;
      case "A* Search":
        visitedNodes = aStar(grid, startNode, finishNode);
        break;
      case "Greedy Best First Search":
        visitedNodes = greedy(grid, startNode, finishNode);
        break;
      default:
        break;
    }

    return visitedNodes;
  };

  getWallNodes = () => {
    const { grid, Maze: maze } = this.state;
    let walls;

    switch (maze) {
      case "Recursive Division":
        walls = getRecursiveDivisionNodes(grid);
        break;
      case "Stair":
        walls = getStairMaze(grid);
        break;
      case "Random":
        walls = getRandom(grid);
        break;

      default:
        break;
    }

    return walls;
  };

  getStartNode = () => {
    const { grid } = this.state;

    for (const row of grid) {
      for (const node of row) {
        if (node.start) return node;
      }
    }
  };

  getFinishNode = () => {
    const { grid } = this.state;

    for (const row of grid) {
      for (const node of row) {
        if (node.finish) return node;
      }
    }
  };

  render() {
    const { grid, Algo: algo, visualizing } = this.state;

    return (
      <div className="App">
        <Navbar
          onAlgoSelect={this.handleOnAlgoSelect}
          onMazeSelect={this.handleOnMazeSelect}
          handleVisualize={() => this.visualize()}
          handleGrid={() => this.resetGrid()}
          algo={algo}
          disable={visualizing}
        />

        <NodeDetails node={grid} />

        <Grid
          grid={grid}
          onMouseDown={this.handleMouseDown}
          onMouseEnter={this.handleMouseEnter}
          onMouseUp={this.handleMouseUp}
        />
      </div>
    );
  }
}

export default App;
