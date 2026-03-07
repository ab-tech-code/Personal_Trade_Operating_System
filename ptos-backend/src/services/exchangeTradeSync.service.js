const ccxt = require("ccxt");
const Trade = require("../models/Trade");
const Exchange = require("../models/Exchange");
const { decrypt } = require("../utils/encryption");
const {
  normalizeExchangeTrade,
} = require("./tradeNormalizer.service");

/**
 * Fetch, verify & store trades from exchange
 */
exports.syncExchangeTrades = async (userId, exchangeId) => {
  const exchangeConfig = await Exchange.findOne({
    _id: exchangeId,
    user: userId,
  });

  if (!exchangeConfig) {
    throw new Error("Exchange not found");
  }

  const ExchangeClass = ccxt[exchangeConfig.exchange];

  if (!ExchangeClass) {
    throw new Error("Unsupported exchange");
  }

const exchange = new ExchangeClass({
  apiKey: decrypt(exchangeConfig.apiKey),
  secret: decrypt(exchangeConfig.apiSecret),
  password: exchangeConfig.apiPassword
    ? decrypt(exchangeConfig.apiPassword)
    : undefined,
  enableRateLimit: true,
  options: {
    defaultType: "future", // important for futures exchanges
  },
});

try {
  // Authentication test
  await exchange.fetchMyTrades(undefined, undefined, 1);

  exchangeConfig.status = "VERIFIED";
} catch (err) {
  console.error("Exchange auth error:", err.message);

  exchangeConfig.status = "AUTH_FAILED";
  await exchangeConfig.save();

  throw new Error(
    "Exchange authentication failed: " + err.message
  );
}

  // Fetch only new trades
  const since = exchangeConfig.lastSyncAt
    ? exchangeConfig.lastSyncAt.getTime()
    : undefined;

  const trades = await exchange.fetchMyTrades(
    undefined,
    since
  );

  let inserted = 0;

  for (const trade of trades) {
    const normalized = normalizeExchangeTrade({
      userId,
      exchange: exchangeConfig.exchange,
      trade,
    });

    // Skip if already imported
    const exists = await Trade.findOne({
      user: userId,
      exchange: exchangeConfig.exchange,
      externalTradeId: normalized.externalTradeId,
    });

    if (exists) {
      continue;
    }

    // Try to match opposite OPEN trade
    const oppositeSide =
      normalized.side === "buy" ? "sell" : "buy";

    const openTrade = await Trade.findOne({
      user: userId,
      symbol: normalized.symbol,
      source: "exchange",
      status: "OPEN",
      side: oppositeSide,
    }).sort({ openedAt: 1 });

    if (openTrade) {
      // Calculate PnL
      const pnl =
        normalized.side === "sell"
          ? (normalized.entryPrice -
              openTrade.entryPrice) *
            openTrade.quantity
          : (openTrade.entryPrice -
              normalized.entryPrice) *
            openTrade.quantity;

      openTrade.exitPrice = normalized.entryPrice;
      openTrade.closedAt = new Date(
        normalized.openedAt
      );
      openTrade.pnl =
        pnl - openTrade.fee - normalized.fee;
      openTrade.status = "CLOSED";

      await openTrade.save();
    } else {
      // Store as OPEN trade
      await Trade.create(normalized);
    }

    inserted++;
  }

  exchangeConfig.lastSyncAt = new Date();
  await exchangeConfig.save();

  return {
    fetched: trades.length,
    inserted,
  };
};