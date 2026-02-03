const mongoose = require("mongoose");
const { encrypt, decrypt } = require("../utils/crypto");

const exchangeConnectionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    exchangeName: {
      type: String,
      required: true,
    },

    apiKey: {
      type: String,
      required: true,
      select: false,
    },

    apiSecret: {
      type: String,
      required: true,
      select: false,
    },

    label: String,

    isActive: {
      type: Boolean,
      default: true,
    },

    lastSyncedAt: Date,
  },
  { timestamps: true }
);

/**
 * Encrypt keys before save
 */
exchangeConnectionSchema.pre("save", function (next) {
  if (this.isModified("apiKey")) {
    this.apiKey = encrypt(this.apiKey);
  }

  if (this.isModified("apiSecret")) {
    this.apiSecret = encrypt(this.apiSecret);
  }

  next();
});

/**
 * Decryption helpers (used during sync only)
 */
exchangeConnectionSchema.methods.getDecryptedKey = function () {
  return decrypt(this.apiKey);
};

exchangeConnectionSchema.methods.getDecryptedSecret = function () {
  return decrypt(this.apiSecret);
};

exchangeConnectionSchema.index(
  { user: 1, exchangeName: 1, label: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "ExchangeConnection",
  exchangeConnectionSchema
);
