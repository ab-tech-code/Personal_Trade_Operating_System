import { apiRequest } from "./api";

/**
 * Connect an exchange
 */
export const connectExchange = async (payload) => {
  return apiRequest("/exchanges/connect", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

/**
 * Fetch connected exchanges
 */
export const fetchExchanges = async () => {
  return apiRequest("/exchanges");
};




/**
 * Trigger exchange sync
 */
export const syncExchange = async (id) => {
  return apiRequest(`/exchanges/${id}/sync`, {
    method: "POST",
  });
};
