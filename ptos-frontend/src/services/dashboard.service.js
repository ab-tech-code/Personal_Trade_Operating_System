import { apiRequest } from "./api";

// src/services/dashboard.service.js
export const fetchDashboardSummary = async () => {
  return apiRequest("/analytics/summary");
};

// Instead of recent-trades, call one of the existing endpoints
export const fetchRecentTrades = async () => {
  return apiRequest("/analytics/strategy-performance"); 
  // or whichever endpoint provides the data you want
};

