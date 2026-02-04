const express = require("express");
const protect = require("../middleware/auth.middleware");
const Trade = require("../models/Trade");

const {
  getSummaryAnalytics,
  getStrategyAnalytics,
  getSymbolAnalytics,
  getMonthlyAnalytics,
} = require("../controllers/analytics.controller");

const router = express.Router();

// --- Existing Routes ---
router.get("/summary", protect, getSummaryAnalytics);
router.get("/strategy", protect, getStrategyAnalytics);
router.get("/symbols", protect, getSymbolAnalytics);
router.get("/monthly", protect, getMonthlyAnalytics);

// --- Equity Curve Route ---
router.get("/equity-curve", protect, async (req, res) => {
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

// --- Win-Loss Route ---
router.get("/win-loss", protect, async (req, res) => {
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

// --- New Monthly Performance Route ---
/**
 * GET /api/analytics/monthly-performance
 * Returns PnL grouped by month
 */
router.get("/monthly-performance", protect, async (req, res) => { // Fixed 'auth' to 'protect'
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
    res
      .status(500)
      .json({ message: "Failed to compute monthly performance" });
  }
});

module.exports = router;