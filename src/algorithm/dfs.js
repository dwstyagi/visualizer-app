const { getNewGrid } = require("./common/newGrid");
const { getUnvisitedNodeNeighbors } = require("./common/unvisitedNodeNeighbor");

export function DepthFirstSearch(grid, startNode) {
  if (!startNode || startNode.finish) return [];

  const newGrid = getNewGrid(grid);

  const unvisitedNodes = [];
  const visitedNodes = [];
  unvisitedNodes.push(startNode);

  while (unvisitedNodes.length) {
    const node = unvisitedNodes.pop();
    visitedNodes.push(node);
    node.visited = true;

    if (!node.start && node.wall) continue;
    if (node.finish) return visitedNodes;

    if (node.distance === Infinity) {
      visitedNodes.pop();
      return visitedNodes;
    }

    const unvisitedNeighbors = getUnvisitedNodeNeighbors(newGrid, node);
    // for (let index = unvisitedNeighbors.length - 1; index >= 0; index--) {
    //   const unvisitedNeighbor = unvisitedNeighbors[index];
    for (let unvisitedNeighbor of unvisitedNeighbors) {
      unvisitedNeighbor.previousNode = node;
      unvisitedNodes.push(unvisitedNeighbor);
    }
  }
  return visitedNodes;
}
