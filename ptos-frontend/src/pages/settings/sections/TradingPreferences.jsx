import React, { useEffect, useState } from "react";
import { apiRequest } from "../../../services/api";
import "../../../styles/settings-trading.css";

const TradingPreferences = () => {
  const [preferences, setPreferences] = useState({
    riskPerTrade: 1,
    defaultPositionSize: 10,
    preferredMarket: "Futures",
    defaultStopLoss: 2,
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const data = await apiRequest("/settings");

        if (data.preferences) {
          setPreferences({
            riskPerTrade: data.preferences.riskPerTrade || 1,
            defaultPositionSize:
              data.preferences.defaultPositionSize || 10,
            preferredMarket:
              data.preferences.preferredMarket || "Futures",
            defaultStopLoss:
              data.preferences.defaultStopLoss || 2,
          });
        }
      } catch {
        setError("Failed to load preferences");
      }
    };

    loadPreferences();
  }, []);

  const validate = () => {
    if (preferences.riskPerTrade <= 0 || preferences.riskPerTrade > 10) {
      return "Risk per trade should be between 0.1% and 10%";
    }

    if (
      preferences.defaultPositionSize <= 0 ||
      preferences.defaultPositionSize > 100
    ) {
      return "Position size must be between 1% and 100%";
    }

    if (
      preferences.defaultStopLoss <= 0 ||
      preferences.defaultStopLoss > 50
    ) {
      return "Stop loss must be between 0.1% and 50%";
    }

    return null;
  };

  const savePreferences = async () => {
    setError("");
    setMessage("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSaving(true);

      await apiRequest("/settings/preferences", {
        method: "PUT",
        body: JSON.stringify(preferences),
      });

      setMessage("✅ Preferences saved successfully");
    } catch (err) {
      setError(err.message || "Failed to save preferences");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="trading-settings">
      {/* Header */}
      <div className="section-header">
        <h2>Trading Preferences</h2>
        <p>Define your default risk and execution behavior</p>
      </div>

      {/* Messages */}
      {error && <div className="error-box">{error}</div>}
      {message && <div className="success-box">{message}</div>}

      {/* Risk Settings */}
      <div className="settings-card">
        <h4>Risk Management</h4>

        <label>
          Risk per Trade: <strong>{preferences.riskPerTrade}%</strong>
          <input
            type="range"
            min="0.1"
            max="10"
            step="0.1"
            value={preferences.riskPerTrade}
            onChange={(e) =>
              setPreferences({
                ...preferences,
                riskPerTrade: Number(e.target.value),
              })
            }
          />
        </label>

        <label>
          Default Stop Loss: <strong>{preferences.defaultStopLoss}%</strong>
          <input
            type="range"
            min="0.1"
            max="50"
            step="0.1"
            value={preferences.defaultStopLoss}
            onChange={(e) =>
              setPreferences({
                ...preferences,
                defaultStopLoss: Number(e.target.value),
              })
            }
          />
        </label>
      </div>

      {/* Execution Settings */}
      <div className="settings-card">
        <h4>Execution Settings</h4>

        <label>
          Default Position Size (%)
          <input
            type="number"
            value={preferences.defaultPositionSize}
            onChange={(e) =>
              setPreferences({
                ...preferences,
                defaultPositionSize: Number(e.target.value),
              })
            }
          />
        </label>

        <label>
          Preferred Market
          <select
            value={preferences.preferredMarket}
            onChange={(e) =>
              setPreferences({
                ...preferences,
                preferredMarket: e.target.value,
              })
            }
          >
            <option>Futures</option>
            <option>Spot</option>
            <option>Options</option>
          </select>
        </label>
      </div>

      {/* Risk Warning */}
      {preferences.riskPerTrade > 5 && (
        <div className="warning-box">
          ⚠️ High risk detected: You are risking more than 5% per trade.
        </div>
      )}

      {/* Action */}
      <div className="form-actions">
        <button
          className="btn primary-btn"
          onClick={savePreferences}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Preferences"}
        </button>
      </div>
    </div>
  );
};

export default TradingPreferences;