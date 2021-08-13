function getLabel(algo) {
  let label = "Visualize";
  if (algo === "Dijkstra Algorithm") label = "Visualize Dijkstra";
  else if (algo === "Depth First Search") label = "Visualize DFS";
  else if (algo === "Breadth First Search") label = "Visualize BFS";
  else if (algo === "Greedy Best First Search") label = "Visualize Greedy";
  else if (algo === "A* Search") label = "Visualize A star";
  return label;
}

module.exports = { getLabel };
