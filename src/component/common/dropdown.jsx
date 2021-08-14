import React from "react";

const Dropdown = ({ label, divider, beforeList, afterList, onSelect }) => {
  return (
    <li className="nav-item dropdown dropdown-hover">
      <a
        className="nav-link dropdown-toggle"
        href="/#"
        id="navbarDropdown"
        data-toggle="dropdown"
        aria-expanded="false"
        style={{ color: "white" }}
      >
        {label}
      </a>
      <div
        className="dropdown-menu dropdown-hover-menu"
        aria-labelledby="navbarDropdown"
      >
        {beforeList.map((item) => (
          <a onClick={onSelect} className="dropdown-item" href="/#">
            {item}
          </a>
        ))}

        {divider && <div className="dropdown-divider"></div>}

        {afterList.map((item) => (
          <a onClick={onSelect} className="dropdown-item" href="/#">
            {item}
          </a>
        ))}
      </div>
    </li>
  );
};

export default Dropdown;
