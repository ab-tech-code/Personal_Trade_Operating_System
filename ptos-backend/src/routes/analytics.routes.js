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

// --- New Equity Curve Route ---
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

// --- Fixed Win-Loss Route ---
router.get("/win-loss", protect, async (req, res) => { // Changed auth to protect
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

module.exports = router;