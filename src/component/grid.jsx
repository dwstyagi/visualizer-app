import React from "react";
import Node from "./node";

const Grid = ({ grid, onMouseDown, onMouseUp, onMouseEnter }) => {
  return (
    <div className="grid">
      {grid.map((row, rowIdx) => {
        return (
          <div className="cur-row" key={rowIdx}>
            {row.map((node, nodeIdx) => (
              <Node
                Key={nodeIdx}
                node={node}
                onMouseDown={onMouseDown}
                onMouseEnter={onMouseEnter}
                onMouseUp={onMouseUp}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default Grid;
