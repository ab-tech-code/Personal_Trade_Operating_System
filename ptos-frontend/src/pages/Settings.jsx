import React, { useState } from "react";
import AppLayout from "../layouts/AppLayout";
import "./Settings.css";

import SettingsSidebar from "./settings/SettingsSidebar";

import ProfileSettings from "./settings/sections/ProfileSettings";
import SecuritySettings from "./settings/sections/SecuritySettings";
import ExchangeSettings from "./settings/sections/ExchangeSettings";
import TradingPreferences from "./settings/sections/TradingPreferences";
import NotificationSettings from "./settings/sections/NotificationSettings";
import DataPrivacySettings from "./settings/sections/DataPrivacySettings";
import DangerZoneSettings from "./settings/sections/DangerZoneSettings";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");

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
      <div className="settings-container">

        <SettingsSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <div className="settings-content">
          {renderContent()}
        </div>

      </div>
    </AppLayout>
  );
};

export default Settings;