/**
 * Normalize CCXT trade into PTOS Trade format
 * Exchange trades are first stored as OPEN
 * They become CLOSED only when matched
 */

const toNumber = (val, fallback = 0) => {
  const num = Number(val);
  return isNaN(num) ? fallback : num;
};

exports.normalizeExchangeTrade = ({
  userId,
  exchange,
  trade,
}) => {
  const amount = toNumber(trade.amount, 0);
  const price = toNumber(trade.price, 0);
  const fee = toNumber(trade?.fee?.cost, 0);

  const timestamp = trade.timestamp
    ? new Date(trade.timestamp)
    : new Date();

  return {
    user: userId,
    source: "exchange",
    exchange,

    externalTradeId: trade.id || null,

    symbol: trade.symbol
      ? trade.symbol.toUpperCase()
      : "UNKNOWN",

    side: trade.side === "buy" ? "buy" : "sell",

    // ✅ Correct quantity (never use cost)
    quantity: amount,

    entryPrice: price,

    exitPrice: null,

    fee: fee,

    pnl: 0,

    openedAt: timestamp,

    closedAt: null,

    status: "OPEN",
  };
};