import React from "react";

const NavbarItem = ({ label, disable, onClick }) => {
  function getClassName(disable) {
    let classes = "nav-link ";
    if (disable) classes += "disabled text-muted";

    return classes;
  }

  return (
    <li className="nav-item">
      <a
        aria-disabled={disable}
        onClick={onClick}
        className={getClassName(disable)}
        style={{ color: "white" }}
        href="/#"
      >
        {label}
      </a>
    </li>
  );
};

export default NavbarItem;
