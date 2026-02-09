import React, { useEffect, useState } from "react";
import AppLayout from "../layouts/AppLayout";
import {
  connectExchange,
  fetchExchanges,
  syncExchange,
} from "../services/exchange.service";
import "./Exchanges.css";

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

      setMessage(
        `${exchange.toUpperCase()} saved. Click "Sync Now" to verify API access.`
      );

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
      setMessage("Exchange verified and synced successfully.");
      loadExchanges();
    } catch (err) {
      setError(err.message || "Sync failed. Check API keys & permissions.");
    } finally {
      setSyncingId(null);
    }
  };

  const renderStatus = (status) => {
    switch (status) {
      case "VERIFIED":
        return <span className="status verified">Verified</span>;
      case "AUTH_FAILED":
        return <span className="status failed">Auth Failed</span>;
      default:
        return <span className="status pending">Unverified</span>;
    }
  };

  return (
    <AppLayout>
      <div className="exchange-container">
        <h1>Exchanges</h1>

        <p className="exchange-subtitle">
          Connect your exchange using <strong>read-only</strong> API keys.
        </p>

        {/* CONNECT FORM */}
        <div className="exchange-card">
          <label>
            Exchange
            <select
              value={exchange}
              onChange={(e) => setExchange(e.target.value)}
            >
              <option value="bybit">Bybit</option>
              <option value="binance">Binance</option>
              <option value="blofin">Blofin</option>
              <option value="bitunix">Bitunix</option>
            </select>
          </label>

          <label>
            API Key
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </label>

          <label>
            API Secret
            <input
              type="password"
              value={apiSecret}
              onChange={(e) => setApiSecret(e.target.value)}
            />
          </label>

          <label>
            API Passphrase (optional)
            <input
              type="password"
              value={apiPassword}
              onChange={(e) => setApiPassword(e.target.value)}
            />
          </label>

          <button className="btn" onClick={handleConnect} disabled={loading}>
            {loading ? "Saving..." : "Connect Exchange"}
          </button>

          {message && <p className="success-msg">{message}</p>}
          {error && <p className="error-msg">{error}</p>}
        </div>

        {/* CONNECTED EXCHANGES */}
        <h2>Connected Exchanges</h2>

        {exchanges.length === 0 ? (
          <p>No exchanges connected yet.</p>
        ) : (
          <div className="exchange-list">
            {exchanges.map((ex) => (
              <div key={ex._id} className="exchange-row">
                <div>
                  <strong>{ex.exchange.toUpperCase()}</strong>
                  <div>{renderStatus(ex.status)}</div>
                  {ex.lastSyncAt && (
                    <small>
                      Last sync:{" "}
                      {new Date(ex.lastSyncAt).toLocaleString()}
                    </small>
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

        <div className="exchange-note">
          🔐 PTOS never places trades. Read-only access only.
        </div>
      </div>
    </AppLayout>
  );
};

export default Exchanges;
