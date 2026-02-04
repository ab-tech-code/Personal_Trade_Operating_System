import React, { useEffect, useState } from "react";
import AppLayout from "../layouts/AppLayout";
import ConnectExchangeModal from "../components/ConnectExchangeModal";
import { fetchExchanges } from "../services/exchange.service";

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

  // Helper to find the connection status for a specific exchange card
  const getStatus = (exchange) => {
    const found = connections.find(
      (c) => c.exchange?.toLowerCase() === exchange.toLowerCase()
    );
    return found ? found.status : "not connected";
  };

  return (
    <AppLayout>
      <h1>Exchange Connections</h1>
      <p className="page-description">
        Manage your API connections. PTOS uses AES-256 encryption to secure your keys.
      </p>

      <div className="exchange-list">
        {AVAILABLE_EXCHANGES.map((ex) => {
          const status = getStatus(ex);
          const isConnected = status === "connected";

          return (
            <div className={`exchange-card ${status}`} key={ex}>
              <h3>{ex}</h3>
              <p>
                Status: <span className={`status-badge ${status}`}>{status}</span>
              </p>
              
              <button 
                className={isConnected ? "btn-secondary" : "btn-primary"}
                onClick={() => setActiveExchange(ex)}
              >
                {isConnected ? "Update Keys" : `Connect ${ex}`}
              </button>
            </div>
          );
        })}
      </div>

      {activeExchange && (
        <ConnectExchangeModal
          exchange={activeExchange}
          onClose={() => setActiveExchange(null)}
          onSuccess={loadExchanges} // This triggers the re-fetch after success!
        />
      )}
    </AppLayout>
  );
};

export default Exchanges;