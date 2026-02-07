const mongoose = require("mongoose");

const exchangeSchema = new mongoose.Schema({
  name: {
    type: String, // binance, bybit, okx
    required: true,
  },
  apiKey: {
    type: String,
  },
  apiSecret: {
    type: String,
  },
  connected: {
    type: Boolean,
    default: false,
  },
  lastSyncAt: Date,
});

const settingsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true,
    },

    exchanges: [exchangeSchema],

    preferences: {
      riskPerTrade: {
        type: Number,
        default: 1, // %
      },
      baseCurrency: {
        type: String,
        default: "USD",
      },
      autoSync: {
        type: Boolean,
        default: false,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Settings", settingsSchema);
