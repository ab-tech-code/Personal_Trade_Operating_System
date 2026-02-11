/**
 * Normalize CCXT trade into PTOS Trade format
 */
exports.normalizeExchangeTrade = ({
  userId,
  exchange,
  trade,
}) => {
  return {
    user: userId,
    source: "exchange",
    exchange,

    externalTradeId: trade.id || null,

    symbol: trade.symbol?.toUpperCase(),

    side: trade.side === "buy" ? "buy" : "sell",

    quantity: trade.amount,

    entryPrice: trade.price,

    exitPrice: trade.price,

    fee: trade.fee?.cost || 0,

    pnl: trade.pnl || 0,

    openedAt: new Date(trade.timestamp),

    closedAt: trade.timestamp ? new Date(trade.timestamp) : null,

    status: "CLOSED",
  };
};
