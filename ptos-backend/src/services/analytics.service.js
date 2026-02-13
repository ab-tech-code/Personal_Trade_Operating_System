const mongoose = require("mongoose");
const Trade = require("../models/Trade");

const CLOSED = "CLOSED";

/**
 * DASHBOARD SUMMARY (AGGREGATED — SCALABLE)
 */
exports.getDashboardSummary = async (userId) => {
  const userObjectId = new mongoose.Types.ObjectId(userId);

  const result = await Trade.aggregate([
    {
      $match: {
        user: userObjectId,
        status: CLOSED,
      },
    },
    {
      $group: {
        _id: null,
        totalTrades: { $sum: 1 },
        totalPnL: { $sum: "$pnl" },
        wins: {
          $sum: { $cond: [{ $gt: ["$pnl", 0] }, 1, 0] },
        },
        losses: {
          $sum: { $cond: [{ $lte: ["$pnl", 0] }, 1, 0] },
        },
        lastActivity: { $max: "$closedAt" },
      },
    },
  ]);

  if (!result.length) {
    return {
      totalTrades: 0,
      totalPnL: 0,
      wins: 0,
      losses: 0,
      winRate: 0,
      lastActivity: null,
    };
  }

  const data = result[0];

  return {
    totalTrades: data.totalTrades,
    totalPnL: Number(data.totalPnL.toFixed(2)),
    wins: data.wins,
    losses: data.losses,
    winRate:
      data.totalTrades === 0
        ? 0
        : Number(((data.wins / data.totalTrades) * 100).toFixed(2)),
    lastActivity: data.lastActivity,
  };
};

/**
 * RECENT TRADES (Last 5 closed)
 */
exports.getRecentTrades = async (userId) => {
  return Trade.find({
    user: userId,
    status: CLOSED,
  })
    .sort({ closedAt: -1 })
    .limit(5);
};

/**
 * STRATEGY PERFORMANCE
 */
exports.getStrategyAnalytics = async (userId) => {
  return Trade.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        status: CLOSED,
      },
    },
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
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        status: CLOSED,
      },
    },
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
        user: new mongoose.Types.ObjectId(userId),
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



/**
 * EQUITY CURVE (CUMULATIVE PnL)
 */
exports.getEquityCurve = async (userId) => {
  const trades = await Trade.find({
    user: userId,
    status: "CLOSED",
    closedAt: { $ne: null },
  })
    .sort({ closedAt: 1 }) // chronological order
    .select("closedAt pnl");

  let cumulative = 0;

  const curve = trades.map((trade) => {
    cumulative += trade.pnl || 0;

    return {
      date: trade.closedAt,
      equity: Number(cumulative.toFixed(2)),
    };
  });

  return curve;
};
