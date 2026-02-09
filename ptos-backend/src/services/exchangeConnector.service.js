const Settings = require("../models/Settings");
const { createExchangeInstance } = require("../exchanges/registry");

/**
 * Create & STRICTLY validate exchange connection
 */
const connectExchange = async (userId, exchangeName) => {
  const settings = await Settings.findOne({ user: userId });

  if (!settings) {
    throw new Error("Settings not found");
  }

  const exchangeConfig = settings.exchanges.find(
    (ex) => ex.name === exchangeName
  );

  if (!exchangeConfig) {
    throw new Error("Exchange config not found");
  }

  const exchange = createExchangeInstance({
    exchange: exchangeName,
    apiKey: exchangeConfig.apiKey,
    apiSecret: exchangeConfig.apiSecret,
    password: exchangeConfig.apiPassword,
  });

  // 1️⃣ Check credentials exist
  exchange.checkRequiredCredentials();

  try {
    // 2️⃣ Force auth-required calls
    await exchange.loadMarkets();

    // Bybit futures auth validation
    if (exchange.has["fetchPositions"]) {
      await exchange.fetchPositions();
    } else {
      // Fallback for spot-only exchanges
      await exchange.fetchMyTrades(undefined, undefined, 1);
    }
  } catch (err) {
    throw new Error(
      `Exchange authentication failed: ${err.message}`
    );
  }

  return true;
};

module.exports = { connectExchange };
