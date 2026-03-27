const ccxt = require("ccxt");
const Trade = require("../models/Trade");
const Exchange = require("../models/Exchange");
const { decrypt } = require("../utils/encryption");
const {
  normalizeExchangeTrade,
} = require("./tradeNormalizer.service");

/**
 * Safe rounding helper
 */
const round = (num, decimals = 4) => {
  return Number(parseFloat(num).toFixed(decimals));
};

/**
 * Retry wrapper for unstable exchange calls
 */
const withRetry = async (fn, retries = 2) => {
  try {
    return await fn();
  } catch (err) {
    if (retries <= 0) throw err;
    return await withRetry(fn, retries - 1);
  }
};

/**
 * Generate stronger unique key (prevents duplicates)
 */
const generateUniqueKey = (trade) => {
  return `${trade.symbol}-${trade.timestamp}-${trade.side}-${trade.amount}-${trade.price}`;
};

/**
 * Sync trades
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
    timeout: 30000,
  });

  /**
   * ✅ AUTH CHECK (stable)
   */
try {
  // ✅ Step 1: check credentials exist
  exchange.checkRequiredCredentials();

  // ✅ Step 2: lightweight API call (MUCH more stable)
  await withRetry(() => exchange.fetchTime());

  exchangeConfig.status = "VERIFIED";
} catch (err) {
  exchangeConfig.status = "AUTH_FAILED";
  await exchangeConfig.save();

  throw new Error(
    "Unable to connect to exchange. Check API keys, permissions, or network."
  );
}

  /**
   * ✅ FETCH TRADES (safe)
   */
  let trades = [];

  try {
    const since = exchangeConfig.lastSyncAt
      ? exchangeConfig.lastSyncAt.getTime()
      : undefined;

    trades = await withRetry(() =>
      exchange.fetchMyTrades(undefined, since)
    );
  } catch (err) {
    throw new Error(
      `Failed to fetch trades: ${exchangeConfig.exchange} ${err.message}`
    );
  }

  let inserted = 0;

  for (const trade of trades) {
    const uniqueKey = generateUniqueKey(trade);

    // 🔥 Strong duplicate protection
    const exists = await Trade.findOne({
      user: userId,
      exchange: exchangeConfig.exchange,
      uniqueKey,
    });

    if (exists) continue;

    const normalized = normalizeExchangeTrade({
      userId,
      exchange: exchangeConfig.exchange,
      trade,
    });

    normalized.uniqueKey = uniqueKey;

    /**
     * MATCH LOGIC
     */
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
      const quantity = Math.min(
        openTrade.quantity,
        normalized.quantity
      );

      const rawPnL =
        normalized.side === "sell"
          ? (normalized.entryPrice - openTrade.entryPrice) *
            quantity
          : (openTrade.entryPrice - normalized.entryPrice) *
            quantity;

      const pnl =
        rawPnL - (openTrade.fee || 0) - (normalized.fee || 0);

      openTrade.exitPrice = normalized.entryPrice;
      openTrade.closedAt = new Date(normalized.openedAt);
      openTrade.pnl = round(pnl, 4);
      openTrade.status = "CLOSED";

      await openTrade.save();
    } else {
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