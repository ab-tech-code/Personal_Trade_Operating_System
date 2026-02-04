const mongoose = require("mongoose");

const ExchangeConnectionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    exchange: {
      type: String,
      required: true,
    },
    apiKey: {
      iv: String,
      content: String,
      tag: String,
    },
    apiSecret: {
      iv: String,
      content: String,
      tag: String,
    },
    status: {
      type: String,
      enum: ["connected", "syncing", "error"],
      default: "connected",
    },
    lastSyncedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "ExchangeConnection",
  ExchangeConnectionSchema
);
