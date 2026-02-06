const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const ExchangeConnection = require("../models/ExchangeConnection");
const { encrypt } = require("../utils/encryption");
const { runTradeSync } = require("../workers/tradeSync.worker");

/**
 * Connect exchange
 */
router.post("/connect", auth, async (req, res) => {
  const { exchange, apiKey, apiSecret } = req.body;

  if (!exchange || !apiKey || !apiSecret) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const connection = await ExchangeConnection.findOneAndUpdate(
    { user: req.user.id, exchange },
    {
      apiKey: encrypt(apiKey),
      apiSecret: encrypt(apiSecret),
      status: "connected",
    },
    { upsert: true, new: true }
  );

  res.json({ message: "Exchange connected", status: connection.status });
});

/**
 * List exchanges
 */
router.get("/", auth, async (req, res) => {
  const exchanges = await ExchangeConnection.find({
    user: req.user.id,
  }).select("-apiKey -apiSecret");

  res.json(exchanges);
});

/**
 * Trigger sync
 */
router.post("/:id/sync", auth, async (req, res) => {
  const connection = await ExchangeConnection.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!connection) {
    return res.status(404).json({ message: "Exchange not found" });
  }

  connection.status = "syncing";
  await connection.save();

  // 🔥 Fire-and-forget worker
  runTradeSync(connection);

  res.json({ message: "Sync started", status: "syncing" });
});

module.exports = router;
