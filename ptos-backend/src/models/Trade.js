const mongoose = require("mongoose");

/**
 * Trade Schema
 * ------------
 * Core entity of PTOS.
 * Each trade belongs to one user.
 */
const tradeSchema = new mongoose.Schema(
  {
    // Owner of the trade
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    /* Market info */
    symbol: {
      type: String,
      required: true,
      uppercase: true,
    },

    marketType: {
      type: String,
      enum: ["forex", "crypto", "stocks", "futures", "other"],
      default: "crypto",
    },

    exchange: {
      type: String, // Binance, Bybit, etc.
    },

    /* Trade direction */
    side: {
      type: String,
      enum: ["long", "short"],
      required: true,
    },

    /* Pricing */
    entryPrice: {
      type: Number,
      required: true,
    },

    exitPrice: {
      type: Number,
    },

    quantity: {
      type: Number,
      required: true,
    },

    leverage: {
      type: Number,
      default: 1,
    },

    externalTradeId: {
      type: String,
      index: true,
    },

    source: {
      type: String,
      enum: ["manual", "exchange"],
      default: "manual",
    },


    /* Risk settings */
    stopLoss: Number,
    takeProfit: Number,

    riskAmount: Number, // risked capital
    rewardAmount: Number,

    /* Result */
    pnl: Number, // profit/loss
    pnlPercent: Number,

    /* Trade lifecycle */
    status: {
      type: String,
      enum: ["open", "closed"],
      default: "closed",
    },

    openedAt: Date,
    closedAt: Date,

    /* Strategy tagging */
    strategy: String,
    setupType: String,

    /* Journal */
    notes: String,

    emotions: {
      type: String,
      enum: [
        "confident",
        "fearful",
        "greedy",
        "neutral",
        "revenge",
      ],
    },

    /* Screenshots (future cloud storage) */
    screenshots: [String],

    /* Import source */
    source: {
      type: String,
      enum: ["manual", "exchange"],
      default: "manual",
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Helpful indexes for analytics speed
 */
tradeSchema.index({ user: 1, createdAt: -1 });
tradeSchema.index({ user: 1, symbol: 1 });

module.exports = mongoose.model("Trade", tradeSchema);
