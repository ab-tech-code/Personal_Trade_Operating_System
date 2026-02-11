const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");

const {
  getDashboardSummary,
  getStrategyAnalytics,
  getSymbolAnalytics,
  getMonthlyAnalytics,
  getRecentTrades,
} = require("../controllers/analytics.controller");

router.get("/summary", auth, getDashboardSummary);
router.get("/recent-trades", auth, getRecentTrades);
router.get("/strategy-performance", auth, getStrategyAnalytics);
router.get("/symbol-performance", auth, getSymbolAnalytics);
router.get("/monthly-performance", auth, getMonthlyAnalytics);

module.exports = router;
