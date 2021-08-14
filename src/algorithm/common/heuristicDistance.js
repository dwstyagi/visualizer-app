export function getHeuristicDistance(first, second) {
  const rows = Math.abs(first.row - second.row);
  const cols = Math.abs(first.col - second.col);

  return rows + cols;
}
