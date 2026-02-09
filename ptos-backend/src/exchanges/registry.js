const ccxt = require("ccxt");

/**
 * Supported exchanges registry
 * Add new exchanges here ONLY
 */
const EXCHANGES = {
  bybit: ccxt.bybit,
  binance: ccxt.binance,
  blofin: ccxt.blofin,
  bitunix: ccxt.bitunix,
};

const createExchangeInstance = ({
  exchange,
  apiKey,
  apiSecret,
  password,
}) => {
  const ExchangeClass = EXCHANGES[exchange];

  if (!ExchangeClass) {
    throw new Error(`Exchange ${exchange} not supported`);
  }

  return new ExchangeClass({
    apiKey,
    secret: apiSecret,
    password, // optional (Bybit does NOT require it)
    enableRateLimit: true,
    options: {
      defaultType: "swap", // futures by default (Bybit)
    },
  });
};

module.exports = { createExchangeInstance };
