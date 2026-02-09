const Settings = require("../models/Settings");
const { createExchangeInstance } = require("../exchanges/registry");

const syncExchange = async (userId, exchangeName) => {
  const settings = await Settings.findOne({ user: userId });

  const exchangeConfig = settings.exchanges.find(
    (e) => e.name === exchangeName
  );

  if (!exchangeConfig) {
    throw new Error("Exchange not configured");
  }

  const exchange = createExchangeInstance({
    exchange: exchangeName,
    apiKey: exchangeConfig.apiKey,
    apiSecret: exchangeConfig.apiSecret,
    password: exchangeConfig.apiPassword,
  });

  try {
    await exchange.loadMarkets();

    // This MUST work or auth is invalid
    const trades = await exchange.fetchMyTrades(undefined, undefined, 1);

    // Mark verified
    exchangeConfig.status = "VERIFIED";
    exchangeConfig.lastSyncAt = new Date();
  } catch (err) {
    exchangeConfig.status = "AUTH_FAILED";
    await settings.save();

    throw new Error(
      "API authentication failed during sync. Check API keys & permissions."
    );
  }

  await settings.save();
  return true;
};

module.exports = { syncExchange };
