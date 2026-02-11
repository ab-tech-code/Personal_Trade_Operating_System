import { apiRequest } from "./api";

/**
 * Fetch dashboard summary stats
 */
export const fetchDashboardSummary = async () => {
  return apiRequest("/analytics/summary");
};

/**
 * Fetch monthly performance
 */
export const fetchMonthlyPerformance = async () => {
  return apiRequest("/analytics/monthly-performance");
};

/**
 * Fetch strategy performance
 */
export const fetchStrategyPerformance = async () => {
  return apiRequest("/analytics/strategy-performance");
};

/**
 * Fetch symbol performance
 */
export const fetchSymbolPerformance = async () => {
  return apiRequest("/analytics/symbol-performance");
};
