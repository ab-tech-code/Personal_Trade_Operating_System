const mongoose = require("mongoose");

const ExchangeConnectionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  exchange: { type: String, required: true }, // e.g., 'Binance', 'Bybit'
  apiKey: {
    content: String,
    iv: String,
    tag: String
  },
  apiSecret: {
    content: String,
    iv: String,
    tag: String
  },
  // Added for Bybit/OKX support
  apiPassphrase: {
    content: String,
    iv: String,
    tag: String
  },
  status: { 
    type: String, 
    enum: ["connected", "syncing", "error"], 
    default: "connected" 
  },
  lastSync: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model("ExchangeConnection", ExchangeConnectionSchema);