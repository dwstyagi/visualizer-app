export function getGrid(grid, start, end) {
  const newGrid = [];

  for (let row = 0; row <= grid.rows; row++) {
    const currentRow = [];
    for (let col = 0; col <= grid.cols; col++) {
      const node = createNode(row, col, start, end);
      currentRow.push(node);
    }
    newGrid.push(currentRow);
  }

  return newGrid;
}

function createNode(row, col, start, end) {
  return {
    row, // Current Row
    col, // Current Col
    start: row === start.row && col === start.col, // start Node
    finish: row === end.row && col === end.col, // end Node
    visited: false, // is yet visited for finding SP
    path: false, // Animate the Shortest Path Node
    instantVisited: false, // is yet visited for finding SP
    instantPath: false, // Animate the Shortest Path Node
    distance: Infinity, // current distance from start Node
    totalDistance: Infinity,
    wall: false, // current Node is wall or not
    animateWall: false,
    previousNode: null, // to track the shortest Path
  };
}

export function getGridWithToggledNode(grid, node) {
  if (node.start || node.finish) return grid;

  const newGrid = grid.slice(0);

  const { row, col } = node;
  const newNode = { ...node, wall: !node.wall };

  if (node.animateWall) newNode.animateWall = false;
  newGrid[row][col] = newNode;

  return newGrid;
}
