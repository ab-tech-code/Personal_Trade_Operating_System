import React, { useState } from "react";
import AppLayout from "../layouts/AppLayout";
import ConnectExchangeModal from "../components/ConnectExchangeModal";

const Exchanges = () => {
  // State to track which exchange the user is currently trying to connect
  const [activeExchange, setActiveExchange] = useState(null);

  return (
    <AppLayout>
      <h1>Exchange Connections</h1>

      <p className="page-description">
        Connect your trading exchanges to automatically sync trades into PTOS.
      </p>

      <div className="exchange-list">
        {["Binance", "Bybit"].map((ex) => (
          <div className="exchange-card" key={ex}>
            <h3>{ex}</h3>
            <p>Status: Not Connected</p>
            <button 
              className="btn-primary" 
              onClick={() => setActiveExchange(ex)}
            >
              Connect {ex}
            </button>
          </div>
        ))}
      </div>

      {/* Conditional rendering for the modal */}
      {activeExchange && (
        <ConnectExchangeModal
          exchange={activeExchange}
          onClose={() => setActiveExchange(null)}
        />
      )}
    </AppLayout>
  );
};

export default Exchanges;
