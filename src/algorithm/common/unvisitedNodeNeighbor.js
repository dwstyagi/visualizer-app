export function getUnvisitedNodeNeighbors(grid, node) {
  const { row, col } = node;
  const neighbors = [];

  if (col > 0) {
    const leftNeighbor = grid[row][col - 1];
    neighbors.push(leftNeighbor);
  }
  if (row > 0) {
    const topNeighbor = grid[row - 1][col];
    neighbors.push(topNeighbor);
  }
  if (col < grid[row].length - 1) {
    const rightNeighbor = grid[row][col + 1];
    neighbors.push(rightNeighbor);
  }
  if (row < grid.length - 1) {
    const downNeighbor = grid[row + 1][col];
    neighbors.push(downNeighbor);
  }

  return neighbors && neighbors.filter((neighbor) => !neighbor.visited);
}
