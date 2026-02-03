const express = require("express");
const protect = require("../middleware/auth.middleware");
const Trade = require("../models/Trade"); // Import the Trade model

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
/**
 * GET /api/analytics/equity-curve
 * Returns cumulative PnL over time
 */
router.get("/equity-curve", protect, async (req, res) => {
  try {
    const trades = await Trade.find({
      user: req.user.id, // Ensure this matches your auth middleware's user object
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

module.exports = router;