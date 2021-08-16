export function getRecursiveBacktrackingNodes(grid) {
  const newGrid = getGridWithWallsNodes(grid);
  const nodes = [];
  const stack = [];
  const node = newGrid[1][1];
  node.wall = false;

  stack.push(node);
  while (stack.length) {
    const currentNode = stack.pop();
    nodes.push(currentNode);
    const nextNode = getNeighbors(newGrid, currentNode);
    if (
      nextNode &&
      !(
        nextNode[0].start ||
        nextNode[0].finish ||
        nextNode[1].start ||
        nextNode[1].finish
      )
    ) {
      stack.push(currentNode);
      const { row: ro, col: co } = nextNode[0];
      newGrid[ro][co].wall = false;
      const { row: r1, col: c1 } = nextNode[1];
      newGrid[r1][c1].wall = false;
      stack.push(nextNode[1]);
      nodes.push(nextNode[0]);
      nodes.push(nextNode[1]);
    }
  }

  return nodes;
}

function getNeighbors(grid, node) {
  const { row, col } = node;
  let neighbors = [];

  if (row > 2) {
    const nodes = [{ ...grid[row - 1][col] }, { ...grid[row - 2][col] }];
    neighbors.push(nodes);
  }
  if (col < grid[0].length - 3) {
    const nodes = [{ ...grid[row][col + 1] }, { ...grid[row][col + 2] }];
    neighbors.push(nodes);
  }
  if (row < grid.length - 3) {
    const nodes = [{ ...grid[row + 1][col] }, { ...grid[row + 2][col] }];
    neighbors.push(nodes);
  }
  if (col > 2) {
    const nodes = [{ ...grid[row][col - 1] }, { ...grid[row][col - 2] }];
    neighbors.push(nodes);
  }

  neighbors = neighbors.filter(
    (neighbor) => neighbor[0].wall && neighbor[1].wall
  );

  const index = Math.floor(Math.random() * neighbors.length);

  return neighbors.length ? neighbors[index] : null;
}

export function getGridWithWallsNodes(grid) {
  const newGrid = JSON.parse(JSON.stringify(grid));

  for (let row = 0; row < newGrid.length; row++) {
    for (let col = 0; col < newGrid[row].length; col++) {
      const node = newGrid[row][col];
      if (node.start || node.finish) continue;
      const newNode = {
        ...node,
        visited: false,
        wall: true,
        animateWall: true,
      };
      newGrid[row][col] = newNode;
    }
  }
  return newGrid;
}
