import React, { useEffect, useState } from "react";
import { apiRequest } from "../../../services/api";
import "../../../styles/settings-exchange.css";

const ExchangeSettings = () => {
  const [settings, setSettings] = useState({
    autoSync: true,
    syncInterval: 15,
    importFees: true,
    autoCloseTrades: true,
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await apiRequest("/settings");

        if (data.exchangeSettings) {
          setSettings(data.exchangeSettings);
        }
      } catch (err) {
        setError("Failed to load exchange settings");
      }
    };

    loadSettings();
  }, []);

  const validate = () => {
    if (settings.syncInterval < 1) {
      return "Sync interval must be at least 1 minute";
    }
    if (settings.syncInterval > 1440) {
      return "Sync interval cannot exceed 1440 minutes (24h)";
    }
    return null;
  };

  const saveSettings = async () => {
    setError("");
    setMessage("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSaving(true);

      await apiRequest("/settings/exchange", {
        method: "PUT",
        body: JSON.stringify(settings),
      });

      setMessage("✅ Exchange settings saved");
    } catch (err) {
      setError(err.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="exchange-settings">
      {/* Header */}
      <div className="section-header">
        <h2>Exchange Settings</h2>
        <p>Control how your exchanges sync and process trades</p>
      </div>

      {/* Messages */}
      {error && <div className="error-box">{error}</div>}
      {message && <div className="success-box">{message}</div>}

      {/* Auto Sync Card */}
      <div className="settings-card">
        <div className="card-header">
          <h4>Auto Sync</h4>
          <label className="switch">
            <input
              type="checkbox"
              checked={settings.autoSync}
              onChange={(e) =>
                setSettings({ ...settings, autoSync: e.target.checked })
              }
            />
            <span className="slider"></span>
          </label>
        </div>

        <p className="card-desc">
          Automatically sync your exchange trades in the background.
        </p>

        {settings.autoSync && (
          <div className="form-group">
            <label>Sync Interval (minutes)</label>
            <input
              type="number"
              value={settings.syncInterval}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  syncInterval: Number(e.target.value),
                })
              }
            />
          </div>
        )}
      </div>

      {/* Trade Processing */}
      <div className="settings-card">
        <h4>Trade Processing</h4>

        <label className="checkbox">
          <input
            type="checkbox"
            checked={settings.importFees}
            onChange={(e) =>
              setSettings({ ...settings, importFees: e.target.checked })
            }
          />
          Import trading fees into PnL
        </label>

        <label className="checkbox">
          <input
            type="checkbox"
            checked={settings.autoCloseTrades}
            onChange={(e) =>
              setSettings({
                ...settings,
                autoCloseTrades: e.target.checked,
              })
            }
          />
          Automatically close matched trades
        </label>
      </div>

      {/* Warning */}
      <div className="warning-box">
        ⚠️ PTOS uses read-only API keys. No trades are executed on your behalf.
      </div>

      {/* Action */}
      <div className="form-actions">
        <button
          className="btn primary-btn"
          onClick={saveSettings}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
};

export default ExchangeSettings;