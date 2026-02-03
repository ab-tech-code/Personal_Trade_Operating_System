import React from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const AppLayout = ({ children }) => {
  return (
    <div className="app-layout">
      <Sidebar />

      <div className="app-content">
        <Topbar />
        <main>{children}</main>
      </div>
    </div>
  );
};

export default AppLayout;
