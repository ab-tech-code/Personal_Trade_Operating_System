const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth.middleware");
const ExchangeConnection = require("../models/ExchangeConnection");
const { encrypt } = require("../utils/encryption");

/**
 * POST /api/exchanges/connect
 * Securely store exchange credentials
 */
router.post("/connect", protect, async (req, res) => {
  try {
    const { exchange, apiKey, apiSecret } = req.body;

    if (!exchange || !apiKey || !apiSecret) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const encryptedKey = encrypt(apiKey);
    const encryptedSecret = encrypt(apiSecret);

    const connection = await ExchangeConnection.findOneAndUpdate(
      { user: req.user.id, exchange },
      {
        apiKey: encryptedKey,
        apiSecret: encryptedSecret,
        status: "connected",
      },
      { upsert: true, new: true }
    );

    res.json({
      message: `${exchange} connected successfully`,
      status: connection.status,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to connect exchange" });
  }
});

/**
 * GET /api/exchanges
 * List connected exchanges
 */
router.get("/", protect, async (req, res) => {
  const exchanges = await ExchangeConnection.find({
    user: req.user.id,
  }).select("-apiKey -apiSecret");

  res.json(exchanges);
});

module.exports = router;
