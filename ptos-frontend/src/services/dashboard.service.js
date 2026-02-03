import { apiRequest } from "./api";

/**
 * Fetch dashboard summary from the Analytics route
 */
export const fetchDashboardSummary = async () => {
  // We change "/dashboard/summary" to "/analytics/summary"
  return apiRequest("/analytics/summary");
};