import React, { useState } from "react";
import { connectExchange } from "../services/exchange.service";

const ConnectExchangeModal = ({ exchange, onClose, onSuccess }) => {
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [apiPassphrase, setApiPassphrase] = useState(""); // New state
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await connectExchange({
        exchange,
        apiKey,
        apiSecret,
        apiPassphrase, // Sent to backend
      });

      setApiKey("");
      setApiSecret("");
      setApiPassphrase("");

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      alert("Failed to connect. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Connect {exchange}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>API Key</label>
            <input type="text" value={apiKey} onChange={(e) => setApiKey(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>API Secret</label>
            <input type="password" value={apiSecret} onChange={(e) => setApiSecret(e.target.value)} required />
          </div>

          {/* Conditional field for Bybit */}
          {exchange.toLowerCase() === "bybit" && (
            <div className="form-group">
              <label>API Passphrase (Password)</label>
              <input 
                type="password" 
                value={apiPassphrase} 
                onChange={(e) => setApiPassphrase(e.target.value)} 
              />
            </div>
          )}

          <div className="modal-actions">
            <button type="submit" disabled={loading}>
              {loading ? "Connecting..." : "Connect"}
            </button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConnectExchangeModal;