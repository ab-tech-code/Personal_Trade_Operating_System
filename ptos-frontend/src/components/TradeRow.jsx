import React from "react";

const TradeRow = ({ trade }) => {
  return (
    <div className="trade-row">
      <span>{trade.symbol}</span>
      <span>{trade.side}</span>
      <span>${trade.entryPrice}</span>
      <span>${trade.pnl}</span>
    </div>
  );
};

export default TradeRow;
