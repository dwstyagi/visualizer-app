const { getAllNodes } = require("./common/allNodes");
const { getHeuristicDistance } = require("./common/heuristicDistance");
const { getNewGrid } = require("./common/newGrid");
const { getUnvisitedNodeNeighbors } = require("./common/unvisitedNodeNeighbor");

function greedy(grid, startNode, finishNode) {
  const newGrid = getNewGrid(grid);

  startNode.distance = 0;
  const visitedNodes = [];

  newGrid[startNode.row][startNode.col] = { ...startNode };

  const unvisitedNodes = getAllNodes(newGrid);

  while (unvisitedNodes.length) {
    updateNodesByDistance(unvisitedNodes);

    const closestNode = unvisitedNodes.shift();
    closestNode.visited = true;
    visitedNodes.push(closestNode);

    if (closestNode.finish) return visitedNodes;

    if (closestNode.wall || closestNode.animateWall) continue;
    if (closestNode.distance === Infinity) return visitedNodes;

    updateClosestNodeNeighbor(newGrid, closestNode, finishNode);
  }
}

function updateClosestNodeNeighbor(grid, node, finishNode) {
  const neighbors = getUnvisitedNodeNeighbors(grid, node);
  for (const neighbor of neighbors) {
    neighbor.distance = getHeuristicDistance(neighbor, finishNode);
    neighbor.previousNode = node;
  }

  return neighbors;
}

function updateNodesByDistance(nodes) {
  return nodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

module.exports = { greedy };
