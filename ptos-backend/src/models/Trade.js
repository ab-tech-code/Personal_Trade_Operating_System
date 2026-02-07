const mongoose = require("mongoose");

const tradeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    symbol: String,

    side: {
      type: String,
      enum: ["long", "short"],
      required: true,
    },

    size: Number,
    entryPrice: Number,
    exitPrice: Number,

    pnl: Number,

    openedAt: Date,
    closedAt: Date,

    status: {
      type: String,
      enum: ["open", "closed"],
      default: "closed",
    },

    source: {
      type: String,
      enum: ["manual", "exchange"],
      default: "manual",
    },

    exchange: {
      type: String,
      default: null,
    },

    externalTradeId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

/**
 * ✅ UNIQUE ONLY FOR EXCHANGE TRADES
 */
tradeSchema.index(
  { user: 1, exchange: 1, externalTradeId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      source: "exchange",
      exchange: { $exists: true, $ne: null },
      externalTradeId: { $exists: true, $ne: null },
    },
  }
);

module.exports = mongoose.model("Trade", tradeSchema);
