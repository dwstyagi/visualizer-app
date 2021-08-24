const { getAllNodes } = require("./common/allNodes");
const { getHeuristicDistance } = require("./common/heuristicDistance");
const { getNewGrid } = require("./common/newGrid");
const { getUnvisitedNodeNeighbors } = require("./common/unvisitedNodeNeighbor");

export function aStar(grid, startNode, finishNode) {
  if (!startNode || !finishNode || startNode.finish) return [];
  const newGrid = getNewGrid(grid);

  startNode.distance = 0;
  startNode.totalDistance = 0;

  const visitedNodes = [];

  newGrid[startNode.row][startNode.col] = { ...startNode };
  const unvisitedNodes = getAllNodes(newGrid);

  while (unvisitedNodes.length) {
    updateNodesByTotalDistance(unvisitedNodes);

    const closestNode = unvisitedNodes.shift();
    closestNode.visited = true;
    visitedNodes.push(closestNode);

    if (closestNode.finish) return visitedNodes;

    if (!closestNode.start && (closestNode.wall || closestNode.animateWall))
      continue;
    if (closestNode.totalDistance === Infinity) {
      visitedNodes.pop();
      return visitedNodes;
    }

    updateClosestNodeNeighbor(newGrid, closestNode, finishNode);
  }
}

function updateClosestNodeNeighbor(grid, node, finishNode) {
  const neighbors = getUnvisitedNodeNeighbors(grid, node);
  for (const neighbor of neighbors) {
    neighbor.distance = node.distance + 1;
    const heuristic = getHeuristicDistance(neighbor, finishNode);
    neighbor.totalDistance = neighbor.distance + heuristic;
    neighbor.previousNode = node;
  }

  return neighbors;
}

function updateNodesByTotalDistance(nodes) {
  return nodes.sort(
    (nodeA, nodeB) => nodeA.totalDistance - nodeB.totalDistance
  );
}
