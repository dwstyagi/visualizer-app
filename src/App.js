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

class App extends Component {
  state = {
    grid: [],
    currNode: {},
    prevNode: {},
    start: { row: 10, col: 5 },
    end: { row: 10, col: 47 },
  };

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

  // setNewStartFinishNodeUtil = () => {
  //   const { grid, isStartNode, isFinishNode } = this.state;
  //   const { prevNode, currNode } = this.state;

  //   if (isStartNode) {
  //     prevNode["start"] = false;
  //     currNode["start"] = true;
  //   }
  //   if (isFinishNode) {
  //     prevNode["finish"] = false;
  //     currNode["finish"] = true;
  //   }

  //   grid[prevNode.row][prevNode.col] = { ...prevNode };
  //   grid[currNode.row][currNode.col] = { ...currNode };

  //   this.setState({ grid });
  // };

  // setNewStartFinishNode = (node) => {
  //   const { prevNode, currNode } = this.state;
  //   console.log("previous", prevNode);
  //   console.log("current", currNode);

  //   this.setState({ prevNode: currNode, currNode: node }, () => {
  //     this.setNewStartFinishNodeUtil();
  //   });
  // };

  setNewStartFinishNode = (node) => {
    const { grid, isStartNode, isFinishNode } = this.state;

    this.state.prevNode = this.state.currNode;
    this.state.currNode = node;

    if (isStartNode) {
      this.state.prevNode.start = false;
      this.state.currNode.start = true;
    }

    if (isFinishNode) {
      this.state.prevNode.finish = false;
      this.state.currNode.finish = true;
    }

    grid[this.state.prevNode.row][this.state.prevNode.col] = {
      ...this.state.prevNode,
    };

    grid[this.state.currNode.row][this.state.currNode.col] = {
      ...this.state.currNode,
    };

    this.setState({ grid });
  };

  handleMouseDown = (node) => {
    const { visualizing, grid } = this.state;
    let newNode;
    if (visualizing) return;

    if (node.start) {
      newNode = { ...node, start: !node.start };
      this.setState({ isStartNode: true, currNode: node });
    } else if (node.finish) {
      newNode = { ...node, finish: !node.finish };
      this.setState({ isFinishNode: true, currNode: node });
    } else {
      newNode = { ...node, wall: !node.wall };
      if (node.wall) newNode.animateWall = false;
    }

    grid[node.row][node.col] = newNode;
    this.setState({ grid, isMousePressed: true });
  };

  handleMouseEnter = (node) => {
    const { isMousePressed, grid } = this.state;
    const { isStartNode, isFinishNode, running } = this.state;
    if (isMousePressed) {
      if (isStartNode || isFinishNode) {
        this.resetNodes();
        this.setNewStartFinishNode(node);
        if (running) this.instantVisualize();
      } else {
        const newGrid = getGridWithToggledNode(grid, node);
        this.setState({ grid: newGrid });
      }
    }
  };

  handleMouseUp = (node) => {
    const { isStartNode, isFinishNode, running } = this.state;
    if (isStartNode) node.start = true;
    if (isFinishNode) node.finish = true;

    if (running) this.instantVisualize();

    this.setState({
      isMousePressed: false,
      isStartNode: false,
      isFinishNode: false,
    });
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

  animateShortestPath = (visitedNodesInShortestPath) => {
    const { grid } = this.state;

    for (
      let index = 0;
      index < visitedNodesInShortestPath.length - 1;
      index++
    ) {
      const node = visitedNodesInShortestPath[index];
      const { row, col } = node;
      const newNode = { ...node, path: true };
      setTimeout(() => {
        grid[row][col] = newNode;
        this.setState({ grid });
      }, index * 75);
    }

    setTimeout(() => {
      this.setState({ visualizing: false, running: true });
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
    if (!this.state.Algo) return;

    this.resetNodes();

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
    console.log(visitedNodes);
    if (lastNode.finish)
      visitedNodesInShortestPath = getVisitedNodesInOrder(lastNode);

    this.animateVisitedNodes(visitedNodes, visitedNodesInShortestPath);
  };

  instantVisualize = () => {
    this.resetNodes();
    const startNode = this.getStartNode();
    const finishNode = this.getFinishNode();
    let visitedNodesInShortestPath = [];

    const visitedNodes = this.getVisitedNodes(startNode, finishNode);

    if (!visitedNodes || !visitedNodes.length) return;

    const lastNode = visitedNodes[visitedNodes.length - 1];

    if (lastNode.finish) {
      visitedNodesInShortestPath = getVisitedNodesInOrder(lastNode);
    }

    this.instantVisualizeVisitedNodes(visitedNodes, visitedNodesInShortestPath);
  };

  instantVisualizeVisitedNodes = (visitedNodes, visitedNodesInShortestPath) => {
    const { grid } = this.state;
    for (let i = 0; i <= visitedNodes.length; i++) {
      if (i === visitedNodes.length) {
        this.instantVisualizeShortestPathNodes(visitedNodesInShortestPath);
        return;
      }
      const node = visitedNodes[i];
      const { row, col } = node;
      const newNode = { ...node, visited: false, instantVisited: true };
      grid[row][col] = { ...newNode };
    }
    this.setState({ grid });
  };

  instantVisualizeShortestPathNodes = (visitedNodesInShortestPath) => {
    if (!visitedNodesInShortestPath.length) return;
    const { grid } = this.state;

    for (let index = 0; index < visitedNodesInShortestPath.length; index++) {
      const node = visitedNodesInShortestPath[index];
      const { row, col } = node;
      const newNode = { ...node, path: false, instantPath: true };
      grid[row][col] = newNode;
    }

    this.setState({ grid });
  };

  getShortesPathNodes = () => {
    let node = this.getFinishNode();
    const nodes = [];

    while (!node.start) {
      nodes.push(node);
      node = node.previousNode;
    }

    return nodes;
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
    const { grid } = this.state;
    const newGrid = getGridWithWallsNodes(grid);

    this.resetNodes(1);
    this.setState({ visualizing: true, grid: newGrid });

    const walls = getRecursiveBacktrackingNodes(newGrid);
    this.animateRecursiveBacktracking(walls);
  };

  animateMaze = (walls, maze) => {
    const { grid } = this.state;
    let newGrid = [];

    newGrid = JSON.parse(JSON.stringify(grid));
    if (maze === "Recursive Backtracking")
      newGrid = getGridWithWallsNodes(grid);

    for (let i = 0; i < walls.length; i++) {
      const node = walls[i];
      const newNode = { ...node, wall: true, animateWall: true };

      if (maze === "Recursive Backtracking") {
        newNode["animateWall"] = false;
        newNode["wall"] = false;
      }

      const { row, col } = newNode;
      setTimeout(() => {
        newGrid[row][col] = newNode;
        this.setState({ grid: newGrid });
      }, i * 25);
    }

    setTimeout(() => {
      this.setState({ visualizing: false, running: false });
    }, walls.length * 25);
  };

  visualizeMaze = (maze) => {
    this.resetNodes(1);
    this.setState({ visualizing: true });
    const walls = this.getWallNodes(maze);
    this.animateMaze(walls, maze);
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
