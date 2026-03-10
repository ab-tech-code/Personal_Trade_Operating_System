import React, { useEffect, useState } from "react";
import { apiRequest } from "../../../services/api";

const ExchangeSettings = () => {
  const [settings, setSettings] = useState({
    autoSync: true,
    syncInterval: 15,
    importFees: true,
    autoCloseTrades: true,
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadSettings = async () => {
      const data = await apiRequest("/settings");

      if (data.exchangeSettings) {
        setSettings(data.exchangeSettings);
      }
    };

    loadSettings();
  }, []);

  const saveSettings = async () => {
    setSaving(true);

    await apiRequest("/settings/exchange", {
      method: "PUT",
      body: JSON.stringify(settings),
    });

    setSaving(false);
    setMessage("Exchange settings saved");
  };

  return (
    <div className="settings-section">
      <h2>Exchange Settings</h2>

      <label className="checkbox">
        <input
          type="checkbox"
          checked={settings.autoSync}
          onChange={(e) =>
            setSettings({ ...settings, autoSync: e.target.checked })
          }
        />
        Enable Auto Sync
      </label>

      <label>
        Sync Interval (minutes)
        <input
          type="number"
          value={settings.syncInterval}
          onChange={(e) =>
            setSettings({ ...settings, syncInterval: e.target.value })
          }
        />
      </label>

      <label className="checkbox">
        <input
          type="checkbox"
          checked={settings.importFees}
          onChange={(e) =>
            setSettings({ ...settings, importFees: e.target.checked })
          }
        />
        Import Trading Fees
      </label>

      <label className="checkbox">
        <input
          type="checkbox"
          checked={settings.autoCloseTrades}
          onChange={(e) =>
            setSettings({ ...settings, autoCloseTrades: e.target.checked })
          }
        />
        Automatically Close Matched Trades
      </label>

      <button className="btn" onClick={saveSettings} disabled={saving}>
        {saving ? "Saving..." : "Save Settings"}
      </button>

      {message && <p className="success">{message}</p>}
    </div>
  );
};

export default ExchangeSettings;