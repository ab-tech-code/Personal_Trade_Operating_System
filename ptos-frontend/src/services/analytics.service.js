import { apiRequest } from "./api";

/**
 * Dashboard Summary
 * (PnL, wins, losses, winRate, lastActivity)
 */
export const fetchDashboardSummary = async () => {
  return apiRequest("/analytics/summary");
};

/**
 * Monthly Performance
 */
export const fetchMonthlyPerformance = async () => {
  return apiRequest("/analytics/monthly-performance");
};

/**
 * Strategy Performance
 */
export const fetchStrategyPerformance = async () => {
  return apiRequest("/analytics/strategy-performance");
};

/**
 * Symbol Performance
 */
export const fetchSymbolPerformance = async () => {
  return apiRequest("/analytics/symbol-performance");
};

/**
 * Equity Curve
 */
export const fetchEquityCurve = async () => {
  return apiRequest("/analytics/equity-curve");
};
