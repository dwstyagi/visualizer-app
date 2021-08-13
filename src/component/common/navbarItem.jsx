import React from "react";

const NavbarItem = ({ label, disable, onClick }) => {
  function getClassName(disable) {
    let classes = "nav-link ";
    if (disable) classes += "disabled";

    return classes;
  }
  return (
    <li className="nav-item">
      <a
        aria-disabled={disable}
        onClick={onClick}
        className={getClassName(disable)}
        href="/#"
      >
        {label}
      </a>
    </li>
  );
};

export default NavbarItem;
