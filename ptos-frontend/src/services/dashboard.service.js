import { apiRequest } from "./api";

/**
 * Fetch dashboard summary stats
 */
export const fetchDashboardSummary = async () => {
  return apiRequest("/analytics/summary");
};

/**
 * Fetch recent trades for dashboard
 */
export const fetchRecentTrades = async () => {
  return apiRequest("/analytics/recent-trades");
};
