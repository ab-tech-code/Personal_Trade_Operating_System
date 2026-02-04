import { apiRequest } from "./api";

/**
 * Fetch equity curve data
 */
export const fetchEquityCurve = async () => {
  return apiRequest("/analytics/equity-curve");
};



/**
 * Fetch win/loss distribution
 */
export const fetchWinLoss = async () => {
  return apiRequest("/analytics/win-loss");
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
