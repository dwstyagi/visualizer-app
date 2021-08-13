function getStairMaze(grid) {
  const nodes = [];
  let currentX = grid.length - 2;
  let currentY = 1;

  while (currentX > 0 && currentY < grid[currentX].length - 1) {
    const currentNode = grid[currentX][currentY];
    if (!currentNode.start && !currentNode.finish) nodes.push(currentNode);
    currentX -= 1;
    currentY += 1;
  }

  currentX += 1;
  currentY -= 1;

  while (currentX < grid.length - 1 && currentY < grid[currentX].length - 1) {
    const currentNode = grid[currentX][currentY];
    if (!currentNode.start && !currentNode.finish) nodes.push(currentNode);
    currentX += 1;
    currentY += 1;
  }

  currentX -= 1;
  currentY -= 1;

  while (currentX > 0 && currentY < grid[currentX].length - 1) {
    const currentNode = grid[currentX][currentY];
    if (!currentNode.start && !currentNode.finish) nodes.push(currentNode);
    currentX -= 1;
    currentY += 1;
  }

  return nodes;
}

module.exports = { getStairMaze };
