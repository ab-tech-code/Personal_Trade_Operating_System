import React from "react";

// Add = [] to the destructuring to provide a default value
const RecentTrades = ({ trades = [] }) => {
  return (
    <div className="recent-trades">
      <h3>Recent Trades</h3>

      {/* Adding the ? check is an extra safety layer */}
      {trades?.length === 0 ? (
        <p className="empty-state">
          No trades yet. Connect an exchange or add a trade manually.
        </p>
      ) : (
        trades.map((trade) => (
          <div key={trade._id}>
            {trade.symbol} — {trade.side} — ${trade.pnl}
          </div>
        ))
      )}
    </div>
  );
};

export default RecentTrades;