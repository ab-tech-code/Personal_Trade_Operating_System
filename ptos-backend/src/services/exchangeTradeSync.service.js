const ccxt = require("ccxt");
const Trade = require("../models/Trade");
const Exchange = require("../models/Exchange");
const { decrypt } = require("../utils/encryption");
const {
  normalizeExchangeTrade,
} = require("./tradeNormalizer.service");

/**
 * Fetch & store trades from exchange
 */
exports.syncExchangeTrades = async (userId, exchangeId) => {
  const exchangeConfig = await Exchange.findOne({
    _id: exchangeId,
    user: userId,
    status: "VERIFIED",
  });

  if (!exchangeConfig) {
    throw new Error("Exchange not verified");
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

  // Fetch recent trades
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
      // Ignore duplicate trades (unique index)
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
