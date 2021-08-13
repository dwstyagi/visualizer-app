import React from "react";
import NodeInfo from "./common/nodeInfo";

const mainDivStyle = {
  display: "flex",
  justifyContent: "space-around",
  marginTop: "20px",
};

const NodeDetails = () => {
  return (
    <div className="node-info" style={mainDivStyle}>
      <NodeInfo
        classes={"node"}
        label={"Node"}
        style={{ marginLeft: "40px", fontSize: "18px" }}
      />

      <NodeInfo
        classes={"node"}
        label={"Visited_Node"}
        color={"rgb(0, 190, 218)"}
        style={{ marginLeft: "40px", fontSize: "18px" }}
      />

      <NodeInfo
        classes={"node"}
        label={"Shortest_Path_Node"}
        color={"rgb(255, 254, 106)"}
        style={{ marginLeft: "40px", fontSize: "18px" }}
      />

      <NodeInfo
        classes={"node"}
        label={"Wall_Node"}
        color={"rgb(2, 36, 51)"}
        style={{ marginLeft: "40px", fontSize: "18px" }}
      />

      <NodeInfo
        classes={"node"}
        label={"Start_Node"}
        color={"red"}
        style={{ marginLeft: "40px", fontSize: "18px" }}
      />

      <NodeInfo
        classes={"node"}
        label={"Finish_Node"}
        color={"green"}
        style={{ marginLeft: "40px", fontSize: "18px" }}
      />
    </div>
  );
};

export default NodeDetails;
