import React, { useEffect, useState, useRef } from "react";
import AppLayout from "../layouts/AppLayout";
import ConnectExchangeModal from "../components/ConnectExchangeModal";
import { fetchExchanges, syncExchange } from "../services/exchange.service";

const AVAILABLE_EXCHANGES = ["Binance", "Bybit"];

const Exchanges = () => {
  const [activeExchange, setActiveExchange] = useState(null);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const pollingRef = useRef(null);

  const loadExchanges = async () => {
    try {
      const data = await fetchExchanges();
      setConnections(data);
      
      // If any connection is currently "syncing", we should keep polling
      const isSyncing = data.some(conn => conn.status === "syncing");
      if (!isSyncing && pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    } catch (err) {
      console.error("Failed to load connections:", err);
    } finally {
      setLoading(false);
    }
  };

  // Poll for status updates if something is syncing
  useEffect(() => {
    loadExchanges();

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  const startPolling = () => {
    if (!pollingRef.current) {
      pollingRef.current = setInterval(loadExchanges, 5000); // Check every 5s
    }
  };

  const handleSync = async (id) => {
    try {
      await syncExchange(id);
      loadExchanges();
      startPolling(); // Start polling to watch for the status change
    } catch (err) {
      alert(err.response?.data?.message || "Failed to start sync");
    }
  };

  return (
    <AppLayout>
      <div className="page-header">
        <h1>Exchange Connections</h1>
        
        {/* UPDATED: Dynamic selection for new connections */}
        <div className="add-connection-actions">
          {AVAILABLE_EXCHANGES.map((ex) => (
            <button 
              key={ex}
              className="btn-primary" 
              onClick={() => setActiveExchange(ex)}
              style={{ marginRight: "10px" }}
            >
              + Connect {ex}
            </button>
          ))}
        </div>
      </div>

      <div className="exchange-list">
        {connections.length === 0 && !loading && (
          <p className="empty-state">No exchanges connected yet. Use the buttons above to get started.</p>
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
                  <div className="spinner"></div>
                  <p>Syncing trades...</p>
                </div>
              )}

              {/* Show "Update" button if they want to change keys */}
              <button 
                className="btn-text" 
                onClick={() => setActiveExchange(conn.exchange)}
              >
                Update Keys
              </button>
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