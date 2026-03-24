import React, { useState } from "react";
import { apiRequest } from "../../../services/api";
import "../../../styles/settings-danger.css";

const DangerZoneSettings = () => {
  const [loading, setLoading] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [confirmText, setConfirmText] = useState("");
  const [activeAction, setActiveAction] = useState(null);

  const handleAction = async (type, endpoint, confirmKeyword) => {
    setError("");
    setMessage("");

    if (confirmText !== confirmKeyword) {
      setError(`Type "${confirmKeyword}" to confirm`);
      return;
    }

    try {
      setLoading(type);

      await apiRequest(endpoint, {
        method: "DELETE",
      });

      setMessage("✅ Action completed successfully");
      setConfirmText("");
      setActiveAction(null);
    } catch (err) {
      setError(err.message || "Action failed");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="danger-zone-container">
      {/* Header */}
      <div className="section-header">
        <h2>Danger Zone</h2>
        <p>Irreversible and destructive actions</p>
      </div>

      {/* Messages */}
      {error && <div className="error-box">{error}</div>}
      {message && <div className="success-box">{message}</div>}

      {/* Disconnect Exchanges */}
      <div className="danger-card">
        <h4>Disconnect All Exchanges</h4>
        <p>Remove all API keys and exchange connections.</p>

        <button
          className="btn danger-btn"
          onClick={() => setActiveAction("disconnect")}
        >
          Disconnect Exchanges
        </button>

        {activeAction === "disconnect" && (
          <div className="confirm-box">
            <p>Type <strong>DISCONNECT</strong> to confirm:</p>

            <input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
            />

            <button
              className="btn danger-btn"
              onClick={() =>
                handleAction(
                  "disconnect",
                  "/settings/exchanges/disconnect",
                  "DISCONNECT"
                )
              }
              disabled={loading === "disconnect"}
            >
              {loading === "disconnect" ? "Processing..." : "Confirm"}
            </button>
          </div>
        )}
      </div>

      {/* Reset Trades */}
      <div className="danger-card">
        <h4>Reset Trading Data</h4>
        <p>Delete all trades and analytics permanently.</p>

        <button
          className="btn danger-btn"
          onClick={() => setActiveAction("reset")}
        >
          Reset Trades
        </button>

        {activeAction === "reset" && (
          <div className="confirm-box">
            <p>Type <strong>DELETE</strong> to confirm:</p>

            <input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
            />

            <button
              className="btn danger-btn"
              onClick={() =>
                handleAction(
                  "reset",
                  "/settings/trades/reset",
                  "DELETE"
                )
              }
              disabled={loading === "reset"}
            >
              {loading === "reset" ? "Processing..." : "Confirm"}
            </button>
          </div>
        )}
      </div>

      {/* Delete Account */}
      <div className="danger-card critical">
        <h4>Delete Account</h4>
        <p>Permanently delete your account and all data.</p>

        <button
          className="btn danger-btn"
          onClick={() => setActiveAction("delete")}
        >
          Delete Account
        </button>

        {activeAction === "delete" && (
          <div className="confirm-box">
            <p>
              Type <strong>DELETE ACCOUNT</strong> to confirm:
            </p>

            <input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
            />

            <button
              className="btn danger-btn"
              onClick={() =>
                handleAction(
                  "delete",
                  "/settings/account",
                  "DELETE ACCOUNT"
                )
              }
              disabled={loading === "delete"}
            >
              {loading === "delete" ? "Processing..." : "Confirm"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DangerZoneSettings;