const { normalizeBinanceTrade } = require("./binance.adapter");

const adapters = {
  binance: normalizeBinanceTrade,
  // bybit: normalizeBybitTrade (later)
};

const getAdapter = (exchangeName) => {
  return adapters[exchangeName];
};

module.exports = {
  getAdapter,
};
