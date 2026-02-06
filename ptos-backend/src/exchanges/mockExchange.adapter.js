/**
 * Mock Exchange Adapter
 * ---------------------
 * Simulates fetching trades from an exchange API.
 * This will later be replaced by real Binance / Bybit adapters.
 */

module.exports.fetchTrades = async () => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return [
    {
      symbol: "BTCUSDT",
      side: "long",
      entryPrice: 42000,
      exitPrice: 42500,
      quantity: 0.01,
      pnl: 5,
      openedAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
      closedAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
      strategy: "Exchange Auto Import",
    },
    {
      symbol: "ETHUSDT",
      side: "short",
      entryPrice: 2300,
      exitPrice: 2350,
      quantity: 0.2,
      pnl: -10,
      openedAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
      closedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      strategy: "Exchange Auto Import",
    },
  ];
};
