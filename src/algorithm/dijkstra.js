const { getAllNodes } = require("./common/allNodes");
const { getNewGrid } = require("./common/newGrid");
const { getUnvisitedNodeNeighbors } = require("./common/unvisitedNodeNeighbor");

export function dijkstra(grid, startNode) {
  if (!startNode || startNode.finish) return [];

  const newGrid = getNewGrid(grid);
  const visitedNodes = [];

  startNode.distance = 0;

  newGrid[startNode.row][startNode.col] = { ...startNode };
  const unvisitedNodes = getAllNodes(newGrid);

  while (unvisitedNodes.length) {
    updateNodesByDistance(unvisitedNodes);

    const closestNode = unvisitedNodes.shift();

    closestNode.visited = true;
    visitedNodes.push(closestNode);

    if (closestNode.finish) return visitedNodes;

    if (!closestNode.start && (closestNode.wall || closestNode.animateWall))
      continue;
    if (closestNode.distance === Infinity) return visitedNodes;

    updateClosestNodeNeighbor(newGrid, closestNode);
  }
}

function updateClosestNodeNeighbor(grid, node) {
  const neighbors = getUnvisitedNodeNeighbors(grid, node);
  for (const neighbor of neighbors) {
    neighbor.distance = node.distance + 1;
    neighbor.previousNode = node;
  }

  return neighbors;
}

function updateNodesByDistance(nodes) {
  return nodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}
