import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = ({ open, onClose }) => {
  return (
    <aside className={`sidebar ${open ? "open" : ""}`}>
      <div className="sidebar-header">
        <h2>PTOS</h2>
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
      </div>

      <nav>
        <NavLink to="/app/dashboard">Dashboard</NavLink>
        <NavLink to="/app/trades">Trades</NavLink>
        <NavLink to="/app/analytics">Analytics</NavLink>
        <NavLink to="/app/exchanges">Exchanges</NavLink>
        <NavLink to="/app/settings">Settings</NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;