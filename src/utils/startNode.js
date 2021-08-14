export function getGridWithToggleStartFinishNode(grid, node, isStartNode) {
  //   console.log(node);
  const { row, col } = node;
  const newGrid = JSON.parse(JSON.stringify(grid));
  const newNode = { ...node };

  if (isStartNode && node.start) newNode.start = !node.start;
  if (isStartNode && node.finish) newNode.finish = !node.finish;

  newGrid[row][col] = newNode;

  return newGrid;
}
