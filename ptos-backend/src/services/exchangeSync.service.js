const Trade = require("../models/Trade");
const MockBinanceAdapter = require("../exchanges/MockBinanceAdapter");

const syncExchangeTrades = async (user, credentials) => {
  const adapter = new MockBinanceAdapter(credentials);

  await adapter.connect();
  const rawTrades = await adapter.fetchTrades();

  for (const raw of rawTrades) {
    const tradeData = adapter.normalizeTrade(raw);

    // 🚨 Safety check
    if (!tradeData.externalTradeId || !tradeData.exchange) {
      console.warn("Skipped trade without external identity");
      continue;
    }

    try {
      await Trade.create({
        ...tradeData,
        user: user._id,
        source: "exchange",
      });
    } catch (err) {
      if (err.code !== 11000) {
        throw err;
      }
      // duplicate → ignore
    }
  }
};

module.exports = { syncExchangeTrades };
