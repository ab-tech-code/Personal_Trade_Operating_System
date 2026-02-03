const Trade = require("../models/Trade");


/**
 * Strategy Performance
 * --------------------
 * Shows performance grouped by strategy.
 */
const getStrategyAnalytics = async (req, res) => {
  try {
    const stats = await Trade.aggregate([
      {
        $match: {
          user: req.user._id,
          status: "closed",
        },
      },
      {
        $group: {
          _id: "$strategy",
          totalTrades: { $sum: 1 },
          totalPnL: { $sum: "$pnl" },
          wins: {
            $sum: {
              $cond: [{ $gt: ["$pnl", 0] }, 1, 0],
            },
          },
        },
      },
      { $sort: { totalPnL: -1 } },
    ]);

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: "Strategy analytics failed" });
  }
};


/**
 * Symbol Performance
 */
const getSymbolAnalytics = async (req, res) => {
  try {
    const stats = await Trade.aggregate([
      {
        $match: {
          user: req.user._id,
          status: "closed",
        },
      },
      {
        $group: {
          _id: "$symbol",
          totalTrades: { $sum: 1 },
          totalPnL: { $sum: "$pnl" },
        },
      },
      { $sort: { totalPnL: -1 } },
    ]);

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: "Symbol analytics failed" });
  }
};


/**
 * Monthly Performance
 */
const getMonthlyAnalytics = async (req, res) => {
  try {
    const stats = await Trade.aggregate([
      {
        $match: {
          user: req.user._id,
          status: "closed",
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

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: "Monthly analytics failed" });
  }
};



/**
 * Trading Summary Analytics
 * --------------------------
 * Returns overall performance stats.
 */
const getSummaryAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;

    const stats = await Trade.aggregate([
      {
        $match: {
          user: userId,
          status: "closed",
        },
      },
      {
        $group: {
          _id: null,
          totalTrades: { $sum: 1 },
          totalPnL: { $sum: "$pnl" },
          wins: {
            $sum: {
              $cond: [{ $gt: ["$pnl", 0] }, 1, 0],
            },
          },
          losses: {
            $sum: {
              $cond: [{ $lte: ["$pnl", 0] }, 1, 0],
            },
          },
          avgPnL: { $avg: "$pnl" },
        },
      },
    ]);

    const summary = stats[0] || {
      totalTrades: 0,
      totalPnL: 0,
      wins: 0,
      losses: 0,
      avgPnL: 0,
    };

    const winRate =
      summary.totalTrades > 0
        ? (summary.wins / summary.totalTrades) * 100
        : 0;

    res.status(200).json({
      ...summary,
      winRate: winRate.toFixed(2),
    });
  } catch (error) {
    console.error("Analytics error:", error);

    res.status(500).json({
      message: "Failed to generate analytics",
    });
  }
};

module.exports = {
  getSummaryAnalytics,
  getStrategyAnalytics,
  getSymbolAnalytics,
  getMonthlyAnalytics,
};

