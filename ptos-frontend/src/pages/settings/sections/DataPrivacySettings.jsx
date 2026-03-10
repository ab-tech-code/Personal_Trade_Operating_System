import React, { useState } from "react";
import { apiRequest } from "../../../services/api";

const DataPrivacySettings = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const exportTrades = async () => {
    setLoading(true);

    await apiRequest("/settings/export/trades");

    setLoading(false);
    setMessage("Trades export started");
  };

  const exportAnalytics = async () => {
    setLoading(true);

    await apiRequest("/settings/export/analytics");

    setLoading(false);
    setMessage("Analytics export started");
  };

  const downloadAccountData = async () => {
    setLoading(true);

    await apiRequest("/settings/export/account");

    setLoading(false);
    setMessage("Account data export started");
  };

  return (
    <div className="settings-section">
      <h2>Data & Privacy</h2>

      <div className="settings-action">
        <h4>Export Trades</h4>
        <p>Download your trading history as a CSV file.</p>

        <button className="btn" onClick={exportTrades} disabled={loading}>
          Export Trades
        </button>
      </div>

      <div className="settings-action">
        <h4>Export Analytics</h4>
        <p>Download performance analytics report.</p>

        <button className="btn" onClick={exportAnalytics} disabled={loading}>
          Export Analytics
        </button>
      </div>

      <div className="settings-action">
        <h4>Download Account Data</h4>
        <p>Download all data stored in your account.</p>

        <button
          className="btn"
          onClick={downloadAccountData}
          disabled={loading}
        >
          Download Data
        </button>
      </div>

      {message && <p className="success">{message}</p>}
    </div>
  );
};

export default DataPrivacySettings;