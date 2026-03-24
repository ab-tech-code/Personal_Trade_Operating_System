import React, { useState } from "react";
import { apiRequest } from "../../../services/api";
import "../../../styles/settings-privacy.css";

const DataPrivacySettings = () => {
  const [loading, setLoading] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const downloadFile = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleExport = async (type, endpoint, filename) => {
    setError("");
    setMessage("");

    try {
      setLoading(type);

      const response = await fetch(
        `http://localhost:5000/api${endpoint}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Download failed");
      }

      const blob = await response.blob();
      downloadFile(blob, filename);

      setMessage("✅ Download completed");
    } catch (err) {
      setError(err.message || "Export failed");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="privacy-settings">
      {/* Header */}
      <div className="section-header">
        <h2>Data & Privacy</h2>
        <p>Manage and export your personal trading data</p>
      </div>

      {/* Messages */}
      {error && <div className="error-box">{error}</div>}
      {message && <div className="success-box">{message}</div>}

      {/* Export Trades */}
      <div className="settings-card">
        <h4>Export Trades</h4>
        <p>Download your full trading history (CSV).</p>

        <button
          className="btn primary-btn"
          onClick={() =>
            handleExport("trades", "/settings/export/trades", "trades.csv")
          }
          disabled={loading === "trades"}
        >
          {loading === "trades" ? "Downloading..." : "Download Trades"}
        </button>
      </div>

      {/* Export Analytics */}
      <div className="settings-card">
        <h4>Export Analytics</h4>
        <p>Download your performance reports.</p>

        <button
          className="btn primary-btn"
          onClick={() =>
            handleExport(
              "analytics",
              "/settings/export/analytics",
              "analytics.json"
            )
          }
          disabled={loading === "analytics"}
        >
          {loading === "analytics"
            ? "Downloading..."
            : "Download Analytics"}
        </button>
      </div>

      {/* Export Account Data */}
      <div className="settings-card">
        <h4>Download Account Data</h4>
        <p>Export all stored data (GDPR compliance).</p>

        <button
          className="btn primary-btn"
          onClick={() =>
            handleExport(
              "account",
              "/settings/export/account",
              "account-data.json"
            )
          }
          disabled={loading === "account"}
        >
          {loading === "account"
            ? "Downloading..."
            : "Download Data"}
        </button>
      </div>

      {/* Info */}
      <div className="info-box">
        🔐 Your data is private. You can export or delete it at any time.
      </div>
    </div>
  );
};

export default DataPrivacySettings;