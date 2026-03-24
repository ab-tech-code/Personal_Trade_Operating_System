import React from "react";

const RecentTrades = ({ trades }) => {
  if (!trades || trades.length === 0) {
    return (
      <div className="empty-state">
        No trades yet. Connect an exchange or add manually.
      </div>
    );
  }

  return (
    <div className="recent-trades">
      <h3>Recent Trades</h3>

      <div className="trade-list">
        {trades.map((trade) => {
          const pnlClass =
            trade.pnl >= 0 ? "positive" : "negative";

          return (
            <div key={trade._id} className="trade-item">
              <div>
                <strong>{trade.symbol}</strong>
                <span className="trade-date">
                  {new Date(trade.closedAt).toLocaleDateString()}
                </span>
              </div>

              <div className={`trade-pnl ${pnlClass}`}>
                {trade.pnl >= 0
                  ? `+$${trade.pnl.toFixed(2)}`
                  : `-$${Math.abs(trade.pnl).toFixed(2)}`}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentTrades;