import React from "react";

import { apiRequest } from "./api";

/**
 * Fetch trades with optional filters
 */
export const fetchTrades = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  return apiRequest(`/trades?${params}`);
};

/**
 * Create manual trade
 */
export const createTrade = async (tradeData) => {
  return apiRequest("/trades", {
    method: "POST",
    body: JSON.stringify(tradeData),
  });
};
