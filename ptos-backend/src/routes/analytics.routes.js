const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const Trade = require("../models/Trade");

/**
 * ============================
 * DASHBOARD SUMMARY
 * ============================
 * Used by /app/dashboard
 */
router.get("/summary", auth, async (req, res) => {
  try {
    const trades = await Trade.find({
      user: req.user.id,
      status: "closed",
    });

    const totalPnL = trades.reduce(
      (sum, t) => sum + (t.pnl || 0),
      0
    );

    const wins = trades.filter((t) => t.pnl > 0).length;
    const losses = trades.filter((t) => t.pnl <= 0).length;

    res.json({
      totalPnL,
      winRate:
        trades.length === 0
          ? 0
          : Number(((wins / trades.length) * 100).toFixed(1)),
      totalTrades: trades.length,
      wins,
      losses,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to load dashboard summary" });
  }
});

/**
 * ============================
 * RECENT TRADES
 * ============================
 * Used by Dashboard "Recent Trades"
 */
router.get("/recent-trades", auth, async (req, res) => {
  try {
    const trades = await Trade.find({
      user: req.user.id,
      status: "closed",
    })
      .sort({ closedAt: -1 }) // 🔥 critical
      .limit(5);

    res.json(trades);
  } catch (err) {
    res.status(500).json({ message: "Failed to load recent trades" });
  }
});

/**
 * ============================
 * EQUITY CURVE
 * ============================
 */
router.get("/equity-curve", auth, async (req, res) => {
  try {
    const trades = await Trade.find({
      user: req.user.id,
      status: "closed",
    }).sort({ closedAt: 1 });

    let cumulativePnL = 0;

    const curve = trades.map((trade) => {
      cumulativePnL += trade.pnl || 0;
      return {
        date: trade.closedAt,
        equity: cumulativePnL,
      };
    });

    res.json(curve);
  } catch (err) {
    res.status(500).json({ message: "Failed to compute equity curve" });
  }
});

/**
 * ============================
 * WIN / LOSS
 * ============================
 */
router.get("/win-loss", auth, async (req, res) => {
  try {
    const trades = await Trade.find({
      user: req.user.id,
      status: "closed",
    });

    let wins = 0;
    let losses = 0;

    trades.forEach((trade) => {
      if (trade.pnl > 0) wins++;
      else losses++;
    });

    res.json([
      { name: "Wins", value: wins },
      { name: "Losses", value: losses },
    ]);
  } catch (err) {
    res.status(500).json({ message: "Failed to compute win/loss" });
  }
});

/**
 * ============================
 * MONTHLY PERFORMANCE
 * ============================
 */
router.get("/monthly-performance", auth, async (req, res) => {
  try {
    const trades = await Trade.find({
      user: req.user.id,
      status: "closed",
    });

    const monthlyMap = {};

    trades.forEach((trade) => {
      const date = new Date(trade.closedAt);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      monthlyMap[monthKey] =
        (monthlyMap[monthKey] || 0) + (trade.pnl || 0);
    });

    const result = Object.keys(monthlyMap)
      .sort()
      .map((month) => ({
        month,
        pnl: monthlyMap[month],
      }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Failed to compute monthly performance" });
  }
});

/**
 * ============================
 * STRATEGY PERFORMANCE
 * ============================
 */
router.get("/strategy-performance", auth, async (req, res) => {
  try {
    const trades = await Trade.find({
      user: req.user.id,
      status: "closed",
    });

    const strategyMap = {};

    trades.forEach((trade) => {
      const key = trade.strategy || "Unlabeled";

      if (!strategyMap[key]) {
        strategyMap[key] = {
          strategy: key,
          tradeCount: 0,
          totalPnL: 0,
          wins: 0,
        };
      }

      strategyMap[key].tradeCount += 1;
      strategyMap[key].totalPnL += trade.pnl || 0;

      if (trade.pnl > 0) strategyMap[key].wins += 1;
    });

    const result = Object.values(strategyMap)
      .map((s) => ({
        strategy: s.strategy,
        tradeCount: s.tradeCount,
        totalPnL: s.totalPnL,
        winRate:
          s.tradeCount === 0
            ? 0
            : Number(((s.wins / s.tradeCount) * 100).toFixed(1)),
      }))
      .sort((a, b) => b.totalPnL - a.totalPnL);

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Failed to compute strategy performance" });
  }
});

module.exports = router;
