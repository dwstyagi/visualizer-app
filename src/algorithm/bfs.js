const { getNewGrid } = require("./common/newGrid");
const { getUnvisitedNodeNeighbors } = require("./common/unvisitedNodeNeighbor");

export function breadthFirstSearch(grid, startNode) {
  if (!startNode || startNode.finish) return [];

  const newGrid = getNewGrid(grid);
  const visitedNodes = [];
  const unvisitedNodes = [];

  startNode.visited = true;
  newGrid[startNode.row][startNode.col] = { ...startNode };
  unvisitedNodes.push(startNode);

  while (unvisitedNodes.length) {
    const node = unvisitedNodes.shift();
    visitedNodes.push(node);

    if (node.finish) return visitedNodes;
    if (node.wall || node.animateWall) {
      if (unvisitedNodes.length === 0) return visitedNodes;
      continue;
    }

    const neighbors = getUnvisitedNodeNeighbors(newGrid, node);
    for (const neighbor of neighbors) {
      neighbor.previousNode = node;
      neighbor.visited = true;
      unvisitedNodes.push(neighbor);
    }
  }
}
