/**
 * Normalize CCXT trade into PTOS Trade format
 * Exchange trades are first stored as OPEN
 * They become CLOSED only when matched with opposite side
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

    symbol: trade.symbol
      ? trade.symbol.toUpperCase()
      : null,

    side: trade.side === "buy" ? "buy" : "sell",

    quantity: trade.amount || trade.cost || 0,

    entryPrice: trade.price,

    exitPrice: null,

    fee:
      trade.fee && trade.fee.cost
        ? trade.fee.cost
        : 0,

    pnl: 0,

    openedAt: new Date(trade.timestamp),

    closedAt: null,

    status: "OPEN",
  };
};