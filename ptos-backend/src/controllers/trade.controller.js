const Trade = require("../models/Trade");

/**
 * ==============================
 * CREATE MANUAL TRADE
 * ==============================
 */
exports.createManualTrade = async (req, res) => {
  try {
    const {
      symbol,
      side,
      quantity,
      entryPrice,
      exitPrice,
      openedAt,
      closedAt,
    } = req.body;

    if (!symbol || !side || !quantity || !entryPrice) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Normalize
    const normalizedSymbol = symbol.toUpperCase();
    const normalizedSide = side.toLowerCase();

    if (!["buy", "sell"].includes(normalizedSide)) {
      return res.status(400).json({ message: "Invalid trade side" });
    }

    let pnl = 0;
    let status = "OPEN";
    let finalClosedAt = null;

    if (exitPrice) {
      pnl =
        normalizedSide === "buy"
          ? (exitPrice - entryPrice) * quantity
          : (entryPrice - exitPrice) * quantity;

      status = "CLOSED";
      finalClosedAt = closedAt || new Date();
    }

    const trade = await Trade.create({
      user: req.user.id,
      source: "manual",
      exchange: null,
      symbol: normalizedSymbol,
      side: normalizedSide,
      quantity,
      entryPrice,
      exitPrice: exitPrice || null,
      pnl,
      status,
      openedAt: openedAt || new Date(),
      closedAt: finalClosedAt,
    });

    res.status(201).json(trade);
  } catch (err) {
    console.error("Manual trade error:", err);
    res.status(500).json({ message: "Failed to create manual trade" });
  }
};

/**
 * ==============================
 * LIST TRADES (FILTERABLE)
 * ==============================
 */
exports.getTrades = async (req, res) => {
  try {
    const { source, status, symbol } = req.query;

    const filter = { user: req.user.id };

    if (source) filter.source = source.toLowerCase();
    if (status) filter.status = status.toUpperCase();
    if (symbol) filter.symbol = symbol.toUpperCase();

    const trades = await Trade.find(filter).sort({ openedAt: -1 });

    res.json(trades);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch trades" });
  }
};

/**
 * ==============================
 * UPDATE MANUAL TRADE ONLY
 * ==============================
 */
exports.updateTrade = async (req, res) => {
  try {
    const trade = await Trade.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!trade) {
      return res.status(404).json({ message: "Trade not found" });
    }

    if (trade.source !== "manual") {
      return res.status(403).json({
        message: "Exchange trades cannot be edited",
      });
    }

    const { symbol, side, quantity, entryPrice, exitPrice } = req.body;

    if (symbol) trade.symbol = symbol.toUpperCase();
    if (side) trade.side = side.toLowerCase();
    if (quantity) trade.quantity = quantity;
    if (entryPrice) trade.entryPrice = entryPrice;
    if (exitPrice !== undefined) trade.exitPrice = exitPrice;

    // Recalculate PnL if closed
    if (trade.exitPrice) {
      trade.pnl =
        trade.side === "buy"
          ? (trade.exitPrice - trade.entryPrice) * trade.quantity
          : (trade.entryPrice - trade.exitPrice) * trade.quantity;

      trade.status = "CLOSED";
      trade.closedAt = trade.closedAt || new Date();
    } else {
      trade.status = "OPEN";
      trade.pnl = 0;
      trade.closedAt = null;
    }

    await trade.save();

    res.json(trade);
  } catch (err) {
    res.status(500).json({ message: "Failed to update trade" });
  }
};

/**
 * ==============================
 * DELETE MANUAL TRADE ONLY
 * ==============================
 */
exports.deleteTrade = async (req, res) => {
  try {
    const trade = await Trade.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!trade) {
      return res.status(404).json({ message: "Trade not found" });
    }

    if (trade.source !== "manual") {
      return res.status(403).json({
        message: "Exchange trades cannot be deleted",
      });
    }

    await trade.deleteOne();

    res.json({ message: "Trade deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete trade" });
  }
};
