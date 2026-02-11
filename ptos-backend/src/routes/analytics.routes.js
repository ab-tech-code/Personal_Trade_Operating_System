const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");

const {
  getDashboardSummary,
  getStrategyAnalytics,
  getSymbolAnalytics,
  getMonthlyAnalytics,
} = require("../controllers/analytics.controller");

router.get("/summary", auth, getDashboardSummary);
router.get("/strategy-performance", auth, getStrategyAnalytics);
router.get("/symbol-performance", auth, getSymbolAnalytics);
router.get("/monthly-performance", auth, getMonthlyAnalytics);

module.exports = router;
