const Trade = require("../models/Trade");

/**
 * Import trades into the system safely
 */
exports.importTrades = async (userId, trades) => {
  for (const trade of trades) {
    // Avoid duplicates (important for real exchanges later)
    const exists = await Trade.findOne({
      user: userId,
      symbol: trade.symbol,
      openedAt: trade.openedAt,
      closedAt: trade.closedAt,
    });

    if (exists) continue;

    await Trade.create({
      user: userId,
      symbol: trade.symbol,
      side: trade.side,
      entryPrice: trade.entryPrice,
      exitPrice: trade.exitPrice,
      quantity: trade.quantity,
      pnl: trade.pnl,
      openedAt: trade.openedAt,
      closedAt: trade.closedAt,
      status: "closed",
      strategy: trade.strategy,
      source: "exchange",
    });
  }
};
