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
import { getGridWithWallsNodes } from "./maze/recursiveBacktracking";
import { getRecursiveBacktrackingNodes } from "./maze/recursiveBacktracking";
import { getStairMazeNodes } from "./maze/stair";
import { getRandomNodes } from "./maze/random";
import { getGrid, getGridWithToggledNode } from "./utils/grid";
import { getGridWithToggleStartFinishNode } from "./utils/startNode";

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
    if (this.state.visualizing) return;
    const item = e.target.outerText;
    this.setState({ Algo: item });
  };

  handleOnMazeSelect = (e) => {
    if (this.state.visualizing) return;
    const maze = e.target.outerText;
    this.setState({ Maze: maze });
    this.visualizeMaze(maze);
  };

  setNewStartFinishNode = (node) => {
    const { grid, isStartNode, isFinishNode } = this.state;
    const newGrid = grid.slice();

    this.state.prevNode = { ...this.state.currNode };
    this.state.currNode = { ...node };

    if (isStartNode) {
      this.state.prevNode.start = false;
      this.state.currNode.start = true;
    }

    if (isFinishNode) {
      this.state.prevNode.finish = false;
      this.state.currNode.finish = true;
    }

    newGrid[this.state.currNode.row][this.state.currNode.col] = {
      ...this.state.currNode,
    };
    newGrid[this.state.prevNode.row][this.state.prevNode.col] = {
      ...this.state.prevNode,
    };

    this.setState({ grid: newGrid });
  };

  handleMouseDown = (node) => {
    const { visualizing, grid, isStartNode, isFinishNode } = this.state;
    let newGrid;
    setTimeout(() => {
      if (!visualizing) {
        if (node.start) {
          this.setState({ isStartNode: true, currNode: node });
          newGrid = getGridWithToggleStartFinishNode(grid, node, isStartNode);
        } else if (node.finish) {
          this.setState({ isFinishNode: true, currNode: node });
          newGrid = getGridWithToggleStartFinishNode(grid, node, isFinishNode);
        } else {
          newGrid = getGridWithToggledNode(grid, node);
        }
        this.setState({ grid: newGrid, isMousePressed: true });
      }
    }, this.speed);
  };

  handleMouseEnter = (node) => {
    const { visualizing, isMousePressed, grid } = this.state;
    const { isStartNode, isFinishNode, running } = this.state;

    setTimeout(() => {
      if (!visualizing && isMousePressed) {
        if (isStartNode || isFinishNode) {
          this.resetNodes();
          this.setNewStartFinishNode(node);
          if (running) this.instantVisualize();
        } else {
          const newGrid = getGridWithToggledNode(grid, node);
          this.setState({ grid: newGrid });
        }
      }
    }, this.speed);
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
    const { start, end } = this.state;
    const grid = getGrid(this.grid, start, end);
    this.setState({ grid, running: false });
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

    for (
      let index = 0;
      index < visitedNodesInShortestPath.length - 1;
      index++
    ) {
      const node = visitedNodesInShortestPath[index];
      const { row, col } = node;
      const newNode = { ...node, path: false, instantPath: true };
      grid[row][col] = newNode;
      this.setState({ grid });
    }
  };

  instantVisualizeVisitedNodes = (visitedNodes, visitedNodesInShortestPath) => {
    const { grid } = this.state;
    for (let index = 1; index < visitedNodes.length; index++) {
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
    if (!this.state.running) return;

    let visitedNodes = [];
    const startNode = this.getStartNode();
    const finishNode = this.getFinishNode();

    this.resetNodes();

    visitedNodes = this.getVisitedNodes(startNode, finishNode);

    if (!visitedNodes.length) return;

    let visitedNodesInShortestPath = [];

    let lastNode = visitedNodes[visitedNodes.length - 1];

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

    this.setState({ running: true });

    setTimeout(() => {
      this.setState({ visualizing: false });
    }, visitedNodesInShortestPath.length * 75);
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
    let visitedNodes = [];

    if (!algo) return;

    if (running) {
      this.resetNodes();
    }

    const startNode = this.getStartNode();
    const finishNode = this.getFinishNode();

    this.setState({ visualizing: true });

    visitedNodes = this.getVisitedNodes(startNode, finishNode);

    if (!visitedNodes.length) {
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
      }, i * 50);
    }

    setTimeout(() => {
      this.setState({ visualizing: false });
    }, walls.length * 50);
  };

  visualizeRecursiveBacktracking = () => {
    setTimeout(() => {
      const { grid } = this.state;
      const newGrid = getGridWithWallsNodes(grid);

      this.resetNodes(1);
      this.setState({ visualizing: true, grid: newGrid });

      const walls = getRecursiveBacktrackingNodes(newGrid);
      this.animateRecursiveBacktracking(walls);
    }, this.speed);
  };

  animateMaze = (walls, maze) => {
    const { grid } = this.state;

    for (let i = 0; i < walls.length; i++) {
      const node = walls[i];
      const { row, col } = node;
      const newNode = { ...node, wall: true, animateWall: true };
      if (maze === "Recursive Backtracking") {
        newNode.wall = false;
        newNode.animateWall = false;
      }
      setTimeout(() => {
        grid[row][col] = newNode;
        this.setState({ grid });
      }, i * 50);
    }

    setTimeout(() => {
      this.setState({ visualizing: false });
    }, walls.length * 50);
  };

  visualizeMaze = (maze) => {
    setTimeout(() => {
      this.resetNodes(1);
      const { grid } = this.state;

      let newGrid = JSON.parse(JSON.stringify(grid));
      if (maze === "Recursive Backtracking")
        newGrid = getGridWithWallsNodes(grid);

      this.setState({ visualizing: true, grid: newGrid });

      const walls = this.getWallNodes(maze);
      this.animateMaze(walls, maze);
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

  getWallNodes = (maze) => {
    const { grid } = this.state;
    let walls;

    switch (maze) {
      case "Recursive Backtracking":
        walls = getRecursiveBacktrackingNodes(grid);
        break;
      case "Recursive Division":
        walls = getRecursiveDivisionNodes(grid);
        break;
      case "Stair":
        walls = getStairMazeNodes(grid);
        break;
      case "Random":
        walls = getRandomNodes(grid);
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
