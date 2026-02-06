const ExchangeConnection = require("../models/ExchangeConnection");
const mockExchange = require("../exchanges/mockExchange.adapter");
const { importTrades } = require("../services/tradeImport.service");

/**
 * Run trade sync for a specific exchange connection
 */
exports.runTradeSync = async (connection) => {
  try {
    // 1️⃣ Fetch trades from exchange adapter
    const trades = await mockExchange.fetchTrades();

    // 2️⃣ Import trades into system
    await importTrades(connection.user, trades);

    // 3️⃣ Mark sync complete
    connection.status = "connected";
    connection.lastSyncedAt = new Date();
    await connection.save();
  } catch (err) {
    connection.status = "error";
    await connection.save();
    throw err;
  }
};
