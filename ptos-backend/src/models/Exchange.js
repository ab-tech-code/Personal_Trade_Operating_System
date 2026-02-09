const mongoose = require("mongoose");

const EncryptedFieldSchema = new mongoose.Schema(
  {
    iv: { type: String, required: true },
    content: { type: String, required: true },
    tag: { type: String, required: true },
  },
  { _id: false }
);

const ExchangeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    exchange: {
      type: String,
      required: true,
      lowercase: true,
    },

    apiKey: {
      type: EncryptedFieldSchema,
      required: true,
    },

    apiSecret: {
      type: EncryptedFieldSchema,
      required: true,
    },

    apiPassword: {
      type: EncryptedFieldSchema,
    },

    status: {
      type: String,
      enum: ["CONNECTED_UNVERIFIED", "VERIFIED", "AUTH_FAILED"],
      default: "CONNECTED_UNVERIFIED",
    },

    lastSyncAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Exchange", ExchangeSchema);
