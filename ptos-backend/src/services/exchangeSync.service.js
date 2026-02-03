const ccxt = require("ccxt");
const Trade = require("../models/Trade");
const { getAdapter } = require("../adapters");
const ExchangeSyncJob = require("../models/ExchangeSyncJob");

/**
 * Fetch trades from Binance via CCXT
 */
const fetchBinanceTrades = async (connection) => {
  const exchange = new ccxt.binance({
    apiKey: connection.getDecryptedKey(),
    secret: connection.getDecryptedSecret(),
    enableRateLimit: true,
  });

  await exchange.loadMarkets();
  const trades = await exchange.fetchMyTrades();
  return trades;
};

/**
 * Import Trades Engine
 */
const importTrades = async (exchangeName, trades, userId) => {
  const normalize = getAdapter(exchangeName);
  if (!normalize) throw new Error("No adapter found");

  for (const rawTrade of trades) {
    const normalizedTrade = normalize(rawTrade, userId);

    const exists = await Trade.findOne({
      user: userId,
      externalTradeId: normalizedTrade.externalTradeId,
      exchange: exchangeName,
    });

    if (!exists) {
      await Trade.create(normalizedTrade);
    }
  }
};

/**
 * runExchangeSync
 */
const runExchangeSync = async (jobId) => {
  const job = await ExchangeSyncJob.findById(jobId).populate("exchangeConnection");
  if (!job) return;

  try {
    job.status = "running";
    job.startedAt = new Date();
    await job.save();

    let rawTrades = [];
    if (job.exchangeConnection.exchangeName === "binance") {
      rawTrades = await fetchBinanceTrades(job.exchangeConnection);
    }

    await importTrades(
      job.exchangeConnection.exchangeName,
      rawTrades,
      job.user
    );

    job.status = "completed";
    job.finishedAt = new Date();
    await job.save();
  } catch (error) {
    job.status = "failed";
    job.error = error.message;
    job.finishedAt = new Date();
    await job.save();
  }
};

module.exports = {
  runExchangeSync,
};
