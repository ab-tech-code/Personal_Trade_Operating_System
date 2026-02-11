import { apiRequest } from "./api";

export const fetchDashboardSummary = async () => {
  return apiRequest("/dashboard/summary");
};

export const fetchRecentTrades = async () => {
  return apiRequest("/dashboard/recent-trades");
};
