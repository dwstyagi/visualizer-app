import React from "react";

const NodeInfo = ({ classes, color, style, label }) => {
  return (
    <div className={classes} style={{ backgroundColor: color }}>
      <div style={style}>{label}</div>
    </div>
  );
};

export default NodeInfo;
