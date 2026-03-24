import React, { useEffect, useState } from "react";
import AppLayout from "../layouts/AppLayout";
import {
  connectExchange,
  fetchExchanges,
  syncExchange,
} from "../services/exchange.service";
import "../styles/exchanges.css";

const Exchanges = () => {
  const [exchange, setExchange] = useState("bybit");
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [apiPassword, setApiPassword] = useState("");

  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [syncingId, setSyncingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadExchanges = async () => {
    try {
      const data = await fetchExchanges();
      setExchanges(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadExchanges();
  }, []);

  const handleConnect = async () => {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      await connectExchange({
        exchange,
        apiKey,
        apiSecret,
        apiPassword: apiPassword || undefined,
      });

      setMessage(`${exchange.toUpperCase()} saved. Click Sync to verify.`);
      setApiKey("");
      setApiSecret("");
      setApiPassword("");
      loadExchanges();
    } catch (err) {
      setError(err.message || "Failed to connect exchange");
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async (id) => {
    setSyncingId(id);
    setMessage("");
    setError("");

    try {
      await syncExchange(id);
      setMessage("Exchange verified & synced.");
      loadExchanges();
    } catch (err) {
      setError(err.message || "Sync failed");
    } finally {
      setSyncingId(null);
    }
  };

  const renderStatus = (status) => {
    switch (status) {
      case "VERIFIED":
        return <span className="badge success">Verified</span>;
      case "AUTH_FAILED":
        return <span className="badge danger">Auth Failed</span>;
      default:
        return <span className="badge warning">Unverified</span>;
    }
  };

  return (
    <AppLayout>
      <div className="exchanges-container">
        <h1>Exchange Connections</h1>

        <p className="subtitle">
          Securely connect your exchange using <strong>read-only API keys</strong>.
        </p>

        {/* CONNECT CARD */}
        <div className="card connect-card">
          <h3>Connect New Exchange</h3>

          <div className="form-grid">
            <select
              value={exchange}
              onChange={(e) => setExchange(e.target.value)}
            >
              <option value="bybit">Bybit</option>
              <option value="binance">Binance</option>
              <option value="blofin">Blofin</option>
              <option value="bitunix">Bitunix</option>
            </select>

            <input
              placeholder="API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />

            <input
              type="password"
              placeholder="API Secret"
              value={apiSecret}
              onChange={(e) => setApiSecret(e.target.value)}
            />

            <input
              type="password"
              placeholder="Passphrase (optional)"
              value={apiPassword}
              onChange={(e) => setApiPassword(e.target.value)}
            />
          </div>

          <button
            className="btn primary-btn"
            onClick={handleConnect}
            disabled={loading}
          >
            {loading ? "Connecting..." : "Connect Exchange"}
          </button>

          {message && <p className="success-msg">{message}</p>}
          {error && <p className="error-msg">{error}</p>}
        </div>

        {/* LIST */}
        <h2>Connected Exchanges</h2>

        {exchanges.length === 0 ? (
          <div className="empty-box">
            <p>No exchanges connected</p>
          </div>
        ) : (
          <div className="exchange-grid">
            {exchanges.map((ex) => (
              <div key={ex._id} className="card exchange-item">
                <div className="exchange-top">
                  <h3>{ex.exchange.toUpperCase()}</h3>
                  {renderStatus(ex.status)}
                </div>

                <div className="exchange-meta">
                  {ex.lastSyncAt ? (
                    <span>
                      Last Sync:{" "}
                      {new Date(ex.lastSyncAt).toLocaleString()}
                    </span>
                  ) : (
                    <span>Never synced</span>
                  )}
                </div>

                <button
                  className="btn-outline"
                  onClick={() => handleSync(ex._id)}
                  disabled={syncingId === ex._id}
                >
                  {syncingId === ex._id ? "Syncing..." : "Sync Now"}
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="security-note">
          🔐 PTOS uses read-only access. No trading permissions required.
        </div>
      </div>
    </AppLayout>
  );
};

export default Exchanges;