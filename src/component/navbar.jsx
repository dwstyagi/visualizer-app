import React from "react";
import { getLabel } from "../utils/buttonLabel";
import Dropdown from "./common/dropdown";
import NavbarItem from "./common/navbarItem";
import NavbarTitle from "./common/navbarTitle";

const brand = window.innerWidth > 600 ? "Pathfinding Visualizer" : "Pathfinder";

const beforeList = [
  "Dijkstra Algorithm",
  "Breadth First Search",
  "Depth First Search",
];
const afterList = ["A* Search", "Greedy Best First Search"];
const mazeBeforeList = ["Recursive Backtracking", "Recursive Division"];
const mazeAfterList = ["Stair", "Random"];

const Navbar = (props) => {
  const { onAlgoSelect, onMazeSelect, handleGrid, handleVisualize } = props;
  const { algo, disable } = props;

  return (
    <nav className="navbar navbar-expand navbar-dark bg-dark">
      <NavbarTitle brand={brand} />
      <div className="collapse navbar-collapse" id="myNavbarToggler4">
        <ul className="navbar-nav ms-auto px-3" style={{ marginRight: "15px" }}>
          <Dropdown
            label={"Algorithm"}
            divider={true}
            beforeList={beforeList}
            afterList={afterList}
            onSelect={onAlgoSelect}
          />
          <Dropdown
            label={"Maze"}
            divider={false}
            beforeList={mazeBeforeList}
            afterList={mazeAfterList}
            onSelect={onMazeSelect}
          />

          <NavbarItem
            onClick={handleGrid}
            label={"Reset Grid"}
            disable={disable}
          />

          <NavbarItem
            onClick={handleVisualize}
            label={`${getLabel(algo)}`}
            disable={disable}
          />
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
