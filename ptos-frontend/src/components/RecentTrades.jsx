import React from "react";

const RecentTrades = ({ trades }) => {
  if (!trades || trades.length === 0) {
    return <p>No trades yet. Connect an exchange or add a trade manually.</p>;
  }

  return (
    <div>
      <h3>Recent Trades</h3>
      {trades.map((trade) => (
        <div key={trade._id}>
          <strong>{trade.symbol}</strong> — ${trade.pnl}
        </div>
      ))}
    </div>
  );
};

export default RecentTrades;


