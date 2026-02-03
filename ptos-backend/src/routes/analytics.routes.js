const express = require("express");
const protect = require("../middleware/auth.middleware");

const {
  getSummaryAnalytics,
  getStrategyAnalytics,
  getSymbolAnalytics,
  getMonthlyAnalytics,
} = require("../controllers/analytics.controller");

const router = express.Router();

router.get("/summary", protect, getSummaryAnalytics);
router.get("/strategy", protect, getStrategyAnalytics);
router.get("/symbols", protect, getSymbolAnalytics);
router.get("/monthly", protect, getMonthlyAnalytics);

module.exports = router;
