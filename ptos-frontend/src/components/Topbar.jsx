import React from "react";

const Topbar = ({ onMenuClick }) => {
  return (
    <header className="topbar">
      <button className="menu-btn" onClick={onMenuClick}>
        ☰
      </button>

      <span className="title">
        Personal Trading Operating System
      </span>
    </header>
  );
};

export default Topbar;