import React from "react";

const SettingsSidebar = ({ activeTab, setActiveTab }) => {
  return (
    <div className="settings-sidebar">

      <button
        className={activeTab === "profile" ? "active" : ""}
        onClick={() => setActiveTab("profile")}
      >
        Profile
      </button>

      <button
        className={activeTab === "security" ? "active" : ""}
        onClick={() => setActiveTab("security")}
      >
        Security
      </button>

      <button
        className={activeTab === "exchanges" ? "active" : ""}
        onClick={() => setActiveTab("exchanges")}
      >
        Exchange Settings
      </button>

      <button
        className={activeTab === "preferences" ? "active" : ""}
        onClick={() => setActiveTab("preferences")}
      >
        Trading Preferences
      </button>

      <button
        className={activeTab === "notifications" ? "active" : ""}
        onClick={() => setActiveTab("notifications")}
      >
        Notifications
      </button>

      <button
        className={activeTab === "privacy" ? "active" : ""}
        onClick={() => setActiveTab("privacy")}
      >
        Data & Privacy
      </button>

      <button
        className={activeTab === "danger" ? "active danger" : "danger"}
        onClick={() => setActiveTab("danger")}
      >
        Danger Zone
      </button>

    </div>
  );
};

export default SettingsSidebar;