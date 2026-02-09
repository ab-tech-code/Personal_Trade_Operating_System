const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const Settings = require("../models/Settings");
const { connectExchange } = require("../services/exchangeConnector.service");

/**
 * Connect exchange API keys (STRICT validation)
 */
router.post("/connect", auth, async (req, res) => {
  const { exchange, apiKey, apiSecret, apiPassword } = req.body;

  if (!apiKey || !apiSecret) {
    return res.status(400).json({
      message: "API key and secret are required",
    });
  }

  // Temp settings object for validation
  const tempSettings = {
    exchanges: [
      {
        name: exchange,
        apiKey,
        apiSecret,
        apiPassword,
        connected: true,
      },
    ],
  };

  try {
    // Validate FIRST (no DB write yet)
    await connectExchange(
      { id: req.user.id, ...tempSettings },
      exchange
    );
  } catch (err) {
    return res.status(401).json({
      message: err.message,
    });
  }

  // Save ONLY if validation passed
  const settings = await Settings.findOneAndUpdate(
    { user: req.user.id },
    {
      $pull: { exchanges: { name: exchange } },
    },
    { new: true, upsert: true }
  );

  settings.exchanges.push({
    name: exchange,
    apiKey,
    apiSecret,
    apiPassword,
    connected: true,
  });

  await settings.save();

  res.json({
    message: `${exchange.toUpperCase()} connected successfully`,
  });
});

module.exports = router;
