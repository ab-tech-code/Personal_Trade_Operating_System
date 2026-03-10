import React, { useEffect, useState } from "react";
import { apiRequest } from "../../../services/api";

const TradingPreferences = () => {
  const [preferences, setPreferences] = useState({
    riskPerTrade: 1,
    defaultPositionSize: 10,
    preferredMarket: "Futures",
    defaultStopLoss: 2,
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadPreferences = async () => {
      const data = await apiRequest("/settings");

      if (data.preferences) {
        setPreferences({
          riskPerTrade: data.preferences.riskPerTrade || 1,
          defaultPositionSize: data.preferences.defaultPositionSize || 10,
          preferredMarket: data.preferences.preferredMarket || "Futures",
          defaultStopLoss: data.preferences.defaultStopLoss || 2,
        });
      }
    };

    loadPreferences();
  }, []);

  const savePreferences = async () => {
    setSaving(true);

    await apiRequest("/settings/preferences", {
      method: "PUT",
      body: JSON.stringify(preferences),
    });

    setSaving(false);
    setMessage("Trading preferences saved");
  };

  return (
    <div className="settings-section">
      <h2>Trading Preferences</h2>

      <label>
        Risk per Trade (%)
        <input
          type="number"
          value={preferences.riskPerTrade}
          onChange={(e) =>
            setPreferences({
              ...preferences,
              riskPerTrade: e.target.value,
            })
          }
        />
      </label>

      <label>
        Default Position Size (%)
        <input
          type="number"
          value={preferences.defaultPositionSize}
          onChange={(e) =>
            setPreferences({
              ...preferences,
              defaultPositionSize: e.target.value,
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

      <label>
        Default Stop Loss (%)
        <input
          type="number"
          value={preferences.defaultStopLoss}
          onChange={(e) =>
            setPreferences({
              ...preferences,
              defaultStopLoss: e.target.value,
            })
          }
        />
      </label>

      <button className="btn" onClick={savePreferences} disabled={saving}>
        {saving ? "Saving..." : "Save Preferences"}
      </button>

      {message && <p className="success">{message}</p>}
    </div>
  );
};

export default TradingPreferences;