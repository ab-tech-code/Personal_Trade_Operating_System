const analyticsService = require("../services/analytics.service");

exports.getDashboardSummary = async (req, res) => {
  try {
    const data = await analyticsService.getDashboardSummary(req.user.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to load dashboard summary" });
  }
};

exports.getStrategyAnalytics = async (req, res) => {
  try {
    const data = await analyticsService.getStrategyAnalytics(req.user.id);
    res.json(data);
  } catch {
    res.status(500).json({ message: "Strategy analytics failed" });
  }
};

exports.getSymbolAnalytics = async (req, res) => {
  try {
    const data = await analyticsService.getSymbolAnalytics(req.user.id);
    res.json(data);
  } catch {
    res.status(500).json({ message: "Symbol analytics failed" });
  }
};

exports.getMonthlyAnalytics = async (req, res) => {
  try {
    const data = await analyticsService.getMonthlyAnalytics(req.user.id);
    res.json(data);
  } catch {
    res.status(500).json({ message: "Monthly analytics failed" });
  }
};
