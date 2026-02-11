const Trade = require("../models/Trade");

const CLOSED = "closed";

/**
 * DASHBOARD SUMMARY
 */
exports.getDashboardSummary = async (userId) => {
  const trades = await Trade.find({
    user: userId,
    status: CLOSED,
  }).sort({ closedAt: -1 });

  const totalTrades = trades.length;

  let totalPnL = 0;
  let wins = 0;
  let losses = 0;

  trades.forEach((t) => {
    totalPnL += t.pnl || 0;
    if (t.pnl > 0) wins++;
    else losses++;
  });

  return {
    totalTrades,
    totalPnL: Number(totalPnL.toFixed(2)),
    wins,
    losses,
    winRate:
      totalTrades === 0
        ? 0
        : Number(((wins / totalTrades) * 100).toFixed(2)),
    recentTrades: trades.slice(0, 5),
    lastActivity: trades[0]?.closedAt || null,
  };
};

/**
 * STRATEGY PERFORMANCE
 */
exports.getStrategyAnalytics = async (userId) => {
  return Trade.aggregate([
    { $match: { user: userId, status: CLOSED } },
    {
      $group: {
        _id: "$strategy",
        tradeCount: { $sum: 1 },
        totalPnL: { $sum: "$pnl" },
        wins: {
          $sum: { $cond: [{ $gt: ["$pnl", 0] }, 1, 0] },
        },
      },
    },
    { $sort: { totalPnL: -1 } },
  ]);
};

/**
 * SYMBOL PERFORMANCE
 */
exports.getSymbolAnalytics = async (userId) => {
  return Trade.aggregate([
    { $match: { user: userId, status: CLOSED } },
    {
      $group: {
        _id: "$symbol",
        tradeCount: { $sum: 1 },
        totalPnL: { $sum: "$pnl" },
      },
    },
    { $sort: { totalPnL: -1 } },
  ]);
};

/**
 * MONTHLY PERFORMANCE
 */
exports.getMonthlyAnalytics = async (userId) => {
  return Trade.aggregate([
    {
      $match: {
        user: userId,
        status: CLOSED,
        closedAt: { $ne: null },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$closedAt" },
          month: { $month: "$closedAt" },
        },
        totalPnL: { $sum: "$pnl" },
        trades: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);
};
