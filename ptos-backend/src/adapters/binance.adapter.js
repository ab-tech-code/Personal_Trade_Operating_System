/**
 * Normalize CCXT Binance Trade
 */
const normalizeBinanceTrade = (rawTrade, userId) => {
  return {
    user: userId,
    symbol: rawTrade.symbol,
    marketType: "crypto",
    exchange: "binance",

    side: rawTrade.side === "buy" ? "long" : "short",

    entryPrice: rawTrade.price,
    quantity: rawTrade.amount,

    pnl: rawTrade.cost
      ? rawTrade.cost - rawTrade.fee?.cost || 0
      : 0,

    status: "closed",
    closedAt: new Date(rawTrade.timestamp),

    externalTradeId: rawTrade.id,
    source: "exchange",
  };
};

module.exports = {
  normalizeBinanceTrade,
};
