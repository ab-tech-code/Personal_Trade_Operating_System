import React from "react";

import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="logo">
          PTOS
        </Link>

        <div className="nav-links">
          <Link to="/login">Login</Link>
          <Link to="/register" className="btn">
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
