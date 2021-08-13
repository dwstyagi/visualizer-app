import React from "react";

const NavbarTitle = ({ brand }) => {
  return (
    <>
      <a className="navbar-brand" href="/#">
        {brand}
      </a>
      <button
        className="navbar-toggler"
        data-toggle="collapse"
        data-target="#myNavbarToggler4"
        aria-controls="myNavbarToggler4"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
    </>
  );
};

export default NavbarTitle;
