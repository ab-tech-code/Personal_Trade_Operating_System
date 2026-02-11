const mongoose = require("mongoose");

/**
 * Trade Schema
 * This is the single source of truth for ALL analytics.
 * Every trade (manual or exchange) MUST fit this format.
 */
const TradeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    /**
     * Trade origin
     * - manual: entered by user
     * - exchange: fetched via CCXT
     */
    source: {
      type: String,
      enum: ["manual", "exchange"],
      required: true,
    },

    /**
     * Exchange name
     * null for manual trades
     */
    exchange: {
      type: String,
      lowercase: true,
      default: null,
    },

    /**
     * Unique trade ID from exchange
     * Required ONLY for exchange trades
     */
    externalTradeId: {
      type: String,
      default: null,
    },

    symbol: {
      type: String,
      required: true,
      uppercase: true,
      index: true,
    },

    /**
     * buy = long entry
     * sell = short entry
     */
    side: {
      type: String,
      enum: ["buy", "sell"],
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 0,
    },

    entryPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    exitPrice: {
      type: Number,
      min: 0,
    },

    /**
     * Profit & Loss (absolute value)
     * Positive = win, Negative = loss
     */
    pnl: {
      type: Number,
      default: 0,
    },

    fee: {
      type: Number,
      default: 0,
    },

    openedAt: {
      type: Date,
      required: true,
      index: true,
    },

    closedAt: {
      type: Date,
    },

    status: {
      type: String,
      enum: ["OPEN", "CLOSED"],
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

/**
 * Prevent duplicate exchange trades
 * (manual trades can repeat)
 */
TradeSchema.index(
  {
    user: 1,
    exchange: 1,
    externalTradeId: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      source: "exchange",
      externalTradeId: { $ne: null },
    },
  }
);

module.exports = mongoose.model("Trade", TradeSchema);
