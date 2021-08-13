function getNewGrid(grid) {
  const nodes = [];
  for (const row of grid) {
    const currentRow = [];
    for (const node of row) {
      const newNode = {
        ...node,
        distance: Infinity,
        totalDistance: Infinity,
        visited: false,
      };
      currentRow.push(newNode);
    }
    nodes.push(currentRow);
  }
  return nodes;
}

module.exports = { getNewGrid };
