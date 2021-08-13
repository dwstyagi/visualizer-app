function getRandom(grid) {
  let walls = [];
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const node = grid[row][col];
      if (node.start || node.finish) continue;
      if (Math.random() < 0.3) {
        walls.push(node);
      }
    }
  }
  walls.sort(() => Math.random() - 0.5);
  console.log(walls);
  return walls;
}

module.exports = { getRandom };
