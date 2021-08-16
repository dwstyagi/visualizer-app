import React from "react";

const Node = ({ node, Key, onMouseDown, onMouseEnter, onMouseUp }) => {
  return (
    <div
      id={getNodeId(node)}
      className={getClassName(node)}
      onClick={() => getNode(node)}
      onMouseOver={() => mouseOver(node)}
      onMouseDown={() => onMouseDown(node)}
      onMouseEnter={() => onMouseEnter(node)}
      onMouseUp={() => onMouseUp(node)}
    ></div>
  );
};

function getClassName(node) {
  let classes = "node ";
  classes += node.start
    ? "node-start"
    : node.finish
    ? "node-finish"
    : node.wall
    ? "node-wall"
    : node.animateWall
    ? "node-animate-wall"
    : node.instantPath
    ? "node-instant-path"
    : node.path
    ? "node-path"
    : node.instantVisited
    ? "node-instant-visited"
    : node.visited
    ? "node-visited"
    : "";
  return classes;
}

function mouseOver(node) {
  // console.log(node);
}

function getNode(node) {
  console.log(node);
}

function getNodeId(node) {
  return `node-${node.row}-${node.col}`;
}

export default Node;
