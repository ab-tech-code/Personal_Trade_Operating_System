import { apiRequest } from "./api";

/**
 * Fetch equity curve data
 */
export const fetchEquityCurve = async () => {
  return apiRequest("/analytics/equity-curve");
};
