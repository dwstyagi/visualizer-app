const { getNewGrid } = require("./common/newGrid");
const { getUnvisitedNodeNeighbors } = require("./common/unvisitedNodeNeighbor");

function DepthFirstSearch(grid, startNode) {
  if (!startNode || startNode.finish) {
    return [];
  }

  const newGrid = getNewGrid(grid);

  const unvisitedNodes = [];
  const visitedNodes = [];
  unvisitedNodes.push(startNode);

  while (unvisitedNodes.length) {
    const node = unvisitedNodes.pop();
    visitedNodes.push(node);
    node.visited = true;

    if (node.wall) continue;
    if (node.finish) return visitedNodes;

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

module.exports = { DepthFirstSearch };

// function DepthFirstSearch(grid, startNode) {
//   const newGrid = getNewGrid(grid);
//   const visitedNodes = [];
//   const neighbors = getUnvisitedNodeNeighbors(newGrid, startNode);

//   startNode.visited = true;
//   newGrid[startNode.row][startNode.col] = startNode;

//   for (const neighbor of neighbors) {
//     if (neighbor.wall || neighbor.animateWall) continue;
//     // console.log("neighbor", neighbor);
//     return DepthFirstSearchUtil(newGrid, neighbor, visitedNodes);
//   }
// }

// function DepthFirstSearchUtil(grid, node, visitedNodes) {
//   node.visited = true;
//   visitedNodes.push(node);
//   grid[node.row][node.col] = node;

//   if (node.finish) {
//     console.log("reach finish");
//     return visitedNodes;
//   }

//   const neighbors = getUnvisitedNodeNeighbors(grid, node);
//   for (const neighbor of neighbors) {
//     if (neighbor.wall || neighbor.animateWall) continue;
//     neighbor.previousNode = node;
//     return DepthFirstSearchUtil(grid, neighbor, visitedNodes);
//   }
// }
