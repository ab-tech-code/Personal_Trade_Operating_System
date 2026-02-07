const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const Settings = require("../models/Settings");

/**
 * GET user settings
 */
router.get("/", auth, async (req, res) => {
  let settings = await Settings.findOne({ user: req.user.id });

  if (!settings) {
    settings = await Settings.create({ user: req.user.id });
  }

  res.json(settings);
});

/**
 * UPDATE preferences
 */
router.put("/preferences", auth, async (req, res) => {
  const { riskPerTrade, baseCurrency, autoSync } = req.body;

  const settings = await Settings.findOneAndUpdate(
    { user: req.user.id },
    {
      $set: {
        "preferences.riskPerTrade": riskPerTrade,
        "preferences.baseCurrency": baseCurrency,
        "preferences.autoSync": autoSync,
      },
    },
    { new: true, upsert: true }
  );

  res.json(settings);
});

/**
 * CONNECT / UPDATE exchange keys
 */
router.put("/exchange", auth, async (req, res) => {
  const { name, apiKey, apiSecret } = req.body;

  const settings = await Settings.findOne({ user: req.user.id });

  const existing = settings.exchanges.find(
    (ex) => ex.name === name
  );

  if (existing) {
    existing.apiKey = apiKey;
    existing.apiSecret = apiSecret;
    existing.connected = true;
  } else {
    settings.exchanges.push({
      name,
      apiKey,
      apiSecret,
      connected: true,
    });
  }

  await settings.save();

  res.json({ message: "Exchange connected successfully" });
});

module.exports = router;
