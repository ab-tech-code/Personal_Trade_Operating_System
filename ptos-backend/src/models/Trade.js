const mongoose = require("mongoose");

/**
 * Trade Schema
 * Single source of truth for ALL analytics
 */
const TradeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    source: {
      type: String,
      enum: ["manual", "exchange"],
      required: true,
    },

    exchange: {
      type: String,
      lowercase: true,
      default: null,
    },

    externalTradeId: {
      type: String,
      default: null,
    },

    /**
     * 🔥 NEW: Strong deduplication key
     */
    uniqueKey: {
      type: String,
      index: true,
      default: null,
    },

    symbol: {
      type: String,
      required: true,
      uppercase: true,
      index: true,
    },

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
 * ✅ OLD protection (keep it)
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

/**
 * 🔥 NEW: STRONG duplicate protection
 */
TradeSchema.index(
  {
    user: 1,
    exchange: 1,
    uniqueKey: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      source: "exchange",
      uniqueKey: { $ne: null },
    },
  }
);

module.exports = mongoose.model("Trade", TradeSchema);