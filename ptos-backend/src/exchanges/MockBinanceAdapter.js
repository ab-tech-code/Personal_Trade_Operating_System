const BaseExchangeAdapter = require("./BaseExchangeAdapter");

class MockBinanceAdapter extends BaseExchangeAdapter {
  async connect() {
    return true;
  }

  async fetchTrades() {
    return [
      {
        id: "BN-1001",
        symbol: "BTCUSDT",
        positionSide: "LONG", // realistic exchange field
        qty: 0.01,
        entry: 42000,
        exit: 42500,
        openTime: new Date(Date.now() - 3600000),
        closeTime: new Date(),
      },
    ];
  }

  normalizeTrade(raw) {
    const side =
      raw.positionSide === "LONG" ? "long" : "short";

    const pnl =
      side === "long"
        ? (raw.exit - raw.entry) * raw.qty
        : (raw.entry - raw.exit) * raw.qty;

    return {
      symbol: raw.symbol,
      side,
      size: raw.qty,
      entryPrice: raw.entry,
      exitPrice: raw.exit,
      pnl,
      openedAt: raw.openTime,
      closedAt: raw.closeTime,
      status: "closed",
      source: "exchange",
      exchange: "binance",
      externalTradeId: raw.id,
    };
  }
}

module.exports = MockBinanceAdapter;
