import React, { useState } from "react";
import { connectExchange } from "../services/exchange.service";

const ConnectExchangeModal = ({ exchange, onClose, onSuccess }) => {
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Sends plain text to backend; Backend encrypts immediately
      await connectExchange({
        exchange,
        apiKey,
        apiSecret,
      });

      // 🔐 Immediately wipe secrets from local state for security
      setApiKey("");
      setApiSecret("");

      // Trigger a refresh of the exchange list in the parent component
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error("Connection error:", err);
      alert(err.response?.data?.message || "Failed to connect exchange. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Connect {exchange}</h2>
        <p className="modal-subtitle">
          Please ensure your API keys have <strong>Read-Only</strong> permissions.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>API Key</label>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key"
              required
              autoComplete="off"
            />
          </div>

          <div className="form-group">
            <label>API Secret</label>
            <input
              type="password"
              value={apiSecret}
              onChange={(e) => setApiSecret(e.target.value)}
              placeholder="Enter your API secret"
              required
            />
          </div>

          <div className="modal-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Verifying..." : `Connect ${exchange}`}
            </button>
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConnectExchangeModal;