import React, { useState } from "react";
import AppLayout from "../layouts/AppLayout";

import SettingsSidebar from "./settings/SettingsSidebar";

import ProfileSettings from "./settings/sections/ProfileSettings";
import SecuritySettings from "./settings/sections/SecuritySettings";
import ExchangeSettings from "./settings/sections/ExchangeSettings";
import TradingPreferences from "./settings/sections/TradingPreferences";
import NotificationSettings from "./settings/sections/NotificationSettings";
import DataPrivacySettings from "./settings/sections/DataPrivacySettings";
import DangerZoneSettings from "./settings/sections/DangerZoneSettings";

import "../styles/settings.css";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const getTitle = () => {
    switch (activeTab) {
      case "profile":
        return "Profile Settings";
      case "security":
        return "Security";
      case "exchanges":
        return "Exchange Settings";
      case "preferences":
        return "Trading Preferences";
      case "notifications":
        return "Notifications";
      case "privacy":
        return "Data & Privacy";
      case "danger":
        return "Danger Zone";
      default:
        return "Settings";
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileSettings />;
      case "security":
        return <SecuritySettings />;
      case "exchanges":
        return <ExchangeSettings />;
      case "preferences":
        return <TradingPreferences />;
      case "notifications":
        return <NotificationSettings />;
      case "privacy":
        return <DataPrivacySettings />;
      case "danger":
        return <DangerZoneSettings />;
      default:
        return <ProfileSettings />;
    }
  };

  return (
    <AppLayout>
      <div className="settings-page">
        {/* Sidebar */}
        <SettingsSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Content */}
        <div className="settings-main">
          <div className="settings-header">
            <h1>{getTitle()}</h1>
            <p className="settings-subtitle">
              Manage your account settings and preferences
            </p>
          </div>

          <div className="settings-card">
            {renderContent()}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Settings;