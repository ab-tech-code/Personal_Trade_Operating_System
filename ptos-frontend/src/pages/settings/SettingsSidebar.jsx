import React from "react";
import "../../styles/settings-sidebar.css";

const tabs = [
  { id: "profile", label: "Profile" },
  { id: "security", label: "Security" },
  { id: "exchanges", label: "Exchange Settings" },
  { id: "preferences", label: "Trading Preferences" },
  { id: "notifications", label: "Notifications" },
  { id: "privacy", label: "Data & Privacy" },
  { id: "danger", label: "Danger Zone", danger: true },
];

const SettingsSidebar = ({ activeTab, setActiveTab }) => {
  return (
    <aside className="settings-sidebar">
      <h3 className="sidebar-title">Settings</h3>

      <div className="sidebar-menu">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`sidebar-item 
              ${activeTab === tab.id ? "active" : ""} 
              ${tab.danger ? "danger" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </aside>
  );
};

export default SettingsSidebar;