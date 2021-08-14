const { getNewGrid } = require("./common/newGrid");
const { getUnvisitedNodeNeighbors } = require("./common/unvisitedNodeNeighbor");

export function breadthFirstSearch(grid, startNode) {
  const newGrid = getNewGrid(grid);
  const visitedNodes = [];

  const unvisitedNodes = [];

  startNode.visited = true;

  unvisitedNodes.push(startNode);

  while (unvisitedNodes.length) {
    const node = unvisitedNodes.shift();
    visitedNodes.push(node);

    if (node.finish) return visitedNodes;

    const neighbors = getUnvisitedNodeNeighbors(newGrid, node);
    for (const neighbor of neighbors) {
      if (node.finish) return visitedNodes;
      if (!node.start && (node.wall || node.animateWall)) continue;

      neighbor.previousNode = node;
      neighbor.visited = true;
      unvisitedNodes.push(neighbor);
    }
  }
}
