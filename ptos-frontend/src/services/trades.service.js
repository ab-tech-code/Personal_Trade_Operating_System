import { apiRequest } from "./api";

/**
 * Fetch trades with optional filters
 * Filters:
 *  - source (manual | exchange)
 *  - status (OPEN | CLOSED)
 *  - symbol (BTCUSDT)
 */
export const fetchTrades = async (filters = {}) => {
  const cleanedFilters = {};

  Object.keys(filters).forEach((key) => {
    if (filters[key]) {
      cleanedFilters[key] = filters[key];
    }
  });

  const params = new URLSearchParams(cleanedFilters).toString();

  return apiRequest(`/trades${params ? `?${params}` : ""}`);
};

/**
 * Create manual trade
 */
export const createTrade = async (tradeData) => {
  return apiRequest("/trades/manual", {
    method: "POST",
    body: JSON.stringify(tradeData),
  });
};

/**
 * Update manual trade
 */
export const updateTrade = async (id, tradeData) => {
  return apiRequest(`/trades/${id}`, {
    method: "PUT",
    body: JSON.stringify(tradeData),
  });
};

/**
 * Delete manual trade
 */
export const deleteTrade = async (id) => {
  return apiRequest(`/trades/${id}`, {
    method: "DELETE",
  });
};
