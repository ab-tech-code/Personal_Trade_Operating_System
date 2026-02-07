import React, { useEffect, useState } from "react";
import AppLayout from "../layouts/AppLayout";
import { apiRequest } from "../services/api";
import "./Settings.css";

const Settings = () => {
  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    apiRequest("/settings").then(setSettings);
  }, []);

  const handlePreferenceSave = async () => {
    setSaving(true);
    await apiRequest("/settings/preferences", {
      method: "PUT",
      body: JSON.stringify(settings.preferences),
    });
    setMessage("Preferences saved");
    setSaving(false);
  };

  if (!settings) return <AppLayout>Loading...</AppLayout>;

  return (
    <AppLayout>
      <div className="settings-container">
        <h1>Settings</h1>

        <section className="settings-section">
          <h3>Trading Preferences</h3>

          <label>
            Risk per trade (%)
            <input
              type="number"
              value={settings.preferences.riskPerTrade}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  preferences: {
                    ...settings.preferences,
                    riskPerTrade: e.target.value,
                  },
                })
              }
            />
          </label>

          <label>
            Base Currency
            <select
              value={settings.preferences.baseCurrency}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  preferences: {
                    ...settings.preferences,
                    baseCurrency: e.target.value,
                  },
                })
              }
            >
              <option>USD</option>
              <option>EUR</option>
              <option>NGN</option>
            </select>
          </label>

          <label className="checkbox">
            <input
              type="checkbox"
              checked={settings.preferences.autoSync}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  preferences: {
                    ...settings.preferences,
                    autoSync: e.target.checked,
                  },
                })
              }
            />
            Enable Auto Sync
          </label>

          <button
            className="btn"
            onClick={handlePreferenceSave}
            disabled={saving}
          >
            Save Preferences
          </button>

          {message && <p className="success">{message}</p>}
        </section>
      </div>
    </AppLayout>
  );
};

export default Settings;
