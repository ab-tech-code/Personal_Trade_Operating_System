const mongoose = require("mongoose");

/**
 * Exchange Sync Job
 * ------------------
 * Tracks background sync execution.
 */
const exchangeSyncJobSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    exchangeConnection: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExchangeConnection",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["pending", "running", "completed", "failed"],
      default: "pending",
    },

    error: String,

    startedAt: Date,
    finishedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "ExchangeSyncJob",
  exchangeSyncJobSchema
);
