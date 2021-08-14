export function getVisitedNodesInOrder(node) {
  const visitedNodesInOrder = [];

  while (!node.start) {
    visitedNodesInOrder.unshift(node);
    node = node.previousNode;
  }
  return visitedNodesInOrder;
}
