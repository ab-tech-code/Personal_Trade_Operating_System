const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const Trade = require("../models/Trade");

/**
 * GET /api/dashboard/summary
 */
router.get("/summary", auth, async (req, res) => {
  const trades = await Trade.find({
    user: req.user.id,
    status: "closed",
  });

  const totalPnL = trades.reduce((sum, t) => sum + (t.pnl || 0), 0);

  const wins = trades.filter((t) => t.pnl > 0).length;
  const losses = trades.filter((t) => t.pnl <= 0).length;

  res.json({
    totalPnL,
    winRate:
      trades.length === 0
        ? 0
        : Number(((wins / trades.length) * 100).toFixed(1)),
    totalTrades: trades.length,
  });
});

/**
 * GET /api/dashboard/recent-trades
 */
router.get("/recent-trades", auth, async (req, res) => {
  const trades = await Trade.find({
    user: req.user.id,
    status: "closed",
  })
    .sort({ closedAt: -1 }) // 🔥 IMPORTANT
    .limit(5);

  res.json(trades);
});

module.exports = router;
