export function getVisitedNodesInOrder(node) {
  const visitedNodesInOrder = [];

  while (node) {
    visitedNodesInOrder.unshift(node);
    node = node.previousNode;
  }
  return visitedNodesInOrder;
}
