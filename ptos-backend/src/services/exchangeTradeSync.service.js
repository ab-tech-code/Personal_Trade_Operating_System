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
  // 1️⃣ Find exchange WITHOUT status filter
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
  });

  try {
    // 2️⃣ AUTHENTICATE FIRST (this verifies API keys)
    await exchange.fetchBalance();

    // If authentication succeeds → mark VERIFIED
    exchangeConfig.status = "VERIFIED";
  } catch (err) {
    // If authentication fails → mark AUTH_FAILED
    exchangeConfig.status = "AUTH_FAILED";
    await exchangeConfig.save();
    throw new Error("Authentication failed");
  }

  // 3️⃣ Fetch trades AFTER successful auth
  const trades = await exchange.fetchMyTrades();

  let inserted = 0;

  for (const trade of trades) {
    const normalized = normalizeExchangeTrade({
      userId,
      exchange: exchangeConfig.exchange,
      trade,
    });

    try {
      await Trade.create(normalized);
      inserted++;
    } catch (err) {
      if (err.code !== 11000) {
        throw err;
      }
    }
  }

  exchangeConfig.lastSyncAt = new Date();
  await exchangeConfig.save();

  return {
    fetched: trades.length,
    inserted,
  };
};
