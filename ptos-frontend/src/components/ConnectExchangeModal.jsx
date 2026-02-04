import React from "react"; 

import { useState } from "react";

const ConnectExchangeModal = ({ exchange, onClose }) => {
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // 🔐 Do NOT log or store secrets
    // This will later be sent directly to backend
    console.log("Submitting exchange connection:", exchange);

    // Clear secrets immediately
    setApiKey("");
    setApiSecret("");
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Connect {exchange}</h2>

        <form onSubmit={handleSubmit}>
          <label>
            API Key
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              required
            />
          </label>

          <label>
            API Secret
            <input
              type="password"
              value={apiSecret}
              onChange={(e) => setApiSecret(e.target.value)}
              required
            />
          </label>

          <div className="modal-actions">
            <button type="submit">Connect</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConnectExchangeModal;
