export function getGridWithToggleStartFinishNode(grid, node, isNode) {
  const { row, col } = node;
  const newGrid = JSON.parse(JSON.stringify(grid));
  const newNode = { ...node };

  if (isNode && node.start) newNode.start = !node.start;
  if (isNode && node.finish) newNode.finish = !node.finish;

  newGrid[row][col] = { ...newNode };

  return newGrid;
}
