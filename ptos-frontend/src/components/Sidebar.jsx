import React from "react";

import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <h2 className="sidebar-logo">PTOS</h2>

      <nav>
        <Link to="/app/dashboard">Dashboard</Link>
        <Link to="/app/trades">Trades</Link>
        <Link to="/app/analytics">Analytics</Link>
        <Link to="/app/exchanges">Exchanges</Link>
        <Link to="/app/settings">Settings</Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
