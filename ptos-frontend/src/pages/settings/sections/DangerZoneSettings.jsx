import React, { useState } from "react";
import { apiRequest } from "../../../services/api";

const DangerZoneSettings = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const confirmAction = (text) => {
    return window.confirm(text);
  };

  const disconnectExchanges = async () => {
    if (!confirmAction("Disconnect all exchanges? This cannot be undone.")) {
      return;
    }

    setLoading(true);

    await apiRequest("/settings/exchanges/disconnect", {
      method: "DELETE",
    });

    setLoading(false);
    setMessage("All exchanges disconnected");
  };

  const resetTrades = async () => {
    if (
      !confirmAction(
        "Delete ALL trades? This will permanently remove your trading history."
      )
    ) {
      return;
    }

    setLoading(true);

    await apiRequest("/settings/trades/reset", {
      method: "DELETE",
    });

    setLoading(false);
    setMessage("All trades deleted");
  };

  const deleteAccount = async () => {
    if (
      !confirmAction(
        "Delete your account permanently? This cannot be recovered."
      )
    ) {
      return;
    }

    setLoading(true);

    await apiRequest("/settings/account", {
      method: "DELETE",
    });

    setLoading(false);
    setMessage("Account deletion requested");
  };

  return (
    <div className="settings-section danger-zone">
      <h2>Danger Zone</h2>

      <div className="danger-card">
        <h4>Disconnect All Exchanges</h4>
        <p>Remove all connected exchanges and API keys.</p>

        <button
          className="btn danger"
          onClick={disconnectExchanges}
          disabled={loading}
        >
          Disconnect Exchanges
        </button>
      </div>

      <div className="danger-card">
        <h4>Reset Trading Data</h4>
        <p>Delete all trades and analytics data permanently.</p>

        <button
          className="btn danger"
          onClick={resetTrades}
          disabled={loading}
        >
          Reset Trades
        </button>
      </div>

      <div className="danger-card">
        <h4>Delete Account</h4>
        <p>Permanently delete your account and all stored data.</p>

        <button
          className="btn danger"
          onClick={deleteAccount}
          disabled={loading}
        >
          Delete Account
        </button>
      </div>

      {message && <p className="success">{message}</p>}
    </div>
  );
};

export default DangerZoneSettings;