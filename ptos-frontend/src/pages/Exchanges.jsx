import React, { useEffect, useState } from "react";
import AppLayout from "../layouts/AppLayout";
import ConnectExchangeModal from "../components/ConnectExchangeModal";
import { fetchExchanges, syncExchange } from "../services/exchange.service";

const AVAILABLE_EXCHANGES = ["Binance", "Bybit"];

const Exchanges = () => {
  const [activeExchange, setActiveExchange] = useState(null);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadExchanges = async () => {
    try {
      const data = await fetchExchanges();
      setConnections(data);
    } catch (err) {
      console.error("Failed to load connections:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExchanges();
  }, []);

  const handleSync = async (id) => {
    try {
      await syncExchange(id);
      // Refresh to show "syncing" status immediately
      loadExchanges();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to start sync");
    }
  };

  return (
    <AppLayout>
      <div className="page-header">
        <h1>Exchange Connections</h1>
        <button 
          className="btn-primary" 
          onClick={() => setActiveExchange("Binance")}
        >
          + Add New Connection
        </button>
      </div>

      <div className="exchange-list">
        {/* Render Active Connections */}
        {connections.length === 0 && !loading && (
          <p className="empty-state">No exchanges connected yet.</p>
        )}

        {connections.map((conn) => (
          <div className={`exchange-card ${conn.status}`} key={conn._id}>
            <div className="card-header">
              <h3>{conn.exchange}</h3>
              <span className={`status-badge ${conn.status}`}>{conn.status}</span>
            </div>

            <div className="card-actions">
              {conn.status === "connected" && (
                <button 
                  className="btn-sync" 
                  onClick={() => handleSync(conn._id)}
                >
                  Sync Now
                </button>
              )}

              {conn.status === "syncing" && (
                <div className="syncing-indicator">
                  <span className="spinner"></span>
                  <p>Syncing trades...</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {activeExchange && (
        <ConnectExchangeModal
          exchange={activeExchange}
          onClose={() => setActiveExchange(null)}
          onSuccess={loadExchanges}
        />
      )}
    </AppLayout>
  );
};

export default Exchanges;