const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth.middleware");
const ExchangeConnection = require("../models/ExchangeConnection");
const { encrypt } = require("../utils/encryption");
const { initExchange } = require("../services/exchange.factory");

/**
 * POST /api/exchanges/connect
 * Securely store exchange credentials
 */
router.post("/connect", protect, async (req, res) => {
  try {
    const { exchange, apiKey, apiSecret, apiPassphrase } = req.body;

    if (!exchange || !apiKey || !apiSecret) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Encrypt mandatory keys
    const encryptedKey = encrypt(apiKey);
    const encryptedSecret = encrypt(apiSecret);
    
    // Encrypt passphrase only if provided (Bybit/OKX)
    let encryptedPassphrase = null;
    if (apiPassphrase) {
      encryptedPassphrase = encrypt(apiPassphrase);
    }

    const connection = await ExchangeConnection.findOneAndUpdate(
      { user: req.user.id, exchange },
      {
        apiKey: encryptedKey,
        apiSecret: encryptedSecret,
        apiPassphrase: encryptedPassphrase,
        status: "connected",
      },
      { upsert: true, new: true }
    );

    res.json({
      message: `${exchange} connected successfully`,
      status: connection.status,
    });
  } catch (err) {
    console.error("Connection Error:", err);
    res.status(500).json({ message: "Failed to connect exchange" });
  }
});

/**
 * GET /api/exchanges
 * List connected exchanges
 */
router.get("/", protect, async (req, res) => {
  try {
    const exchanges = await ExchangeConnection.find({
      user: req.user.id,
    }).select("-apiKey -apiSecret");

    res.json(exchanges);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch exchanges" });
  }
});

/**
 * POST /api/exchanges/:id/sync
 * Trigger manual sync (job-based)
 */
router.post("/:id/sync", protect, async (req, res) => {
  try {
    const connection = await ExchangeConnection.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!connection) {
      return res.status(404).json({ message: "Exchange not found" });
    }

    // --- ENHANCEMENT: Check status BEFORE changing anything ---
    if (connection.status === "syncing") {
      return res.status(400).json({ message: "Sync already in progress" });
    }

    // Mark as syncing (worker will handle real sync later)
    connection.status = "syncing";
    await connection.save();

    res.json({
      message: "Sync started",
      status: connection.status,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to start sync" });
  }
});

router.post("/:id/sync", protect, async (req, res) => {
  try {
    const connection = await ExchangeConnection.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!connection) return res.status(404).json({ message: "Exchange not found" });
    if (connection.status === "syncing") return res.status(400).json({ message: "Sync in progress" });

    // 1. Initialize the connection
    const exchange = await initExchange(connection);

    // 2. Perform a "Health Check" (Fetch Balance)
    // This confirms the API keys are valid and have Read permissions
    const balance = await exchange.fetchBalance();

    // 3. If successful, respond to frontend
    res.json({
      message: "Connection verified! Balance fetched.",
      balance: balance.total, // You'll see your coins here!
    });

  } catch (err) {
    console.error("Sync Error:", err.message);
    res.status(500).json({ 
      message: "API Connection Failed", 
      error: err.message 
    });
  }
});

module.exports = router;