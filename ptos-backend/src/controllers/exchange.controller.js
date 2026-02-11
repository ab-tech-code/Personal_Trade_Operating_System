const ccxt = require("ccxt");
const Exchange = require("../models/Exchange");
const { encrypt, decrypt } = require("../utils/encryption");

/**
 * CONNECT EXCHANGE
 * Stores API keys only.
 * Does NOT verify credentials.
 */
exports.connectExchange = async (req, res) => {
  const userId = req.user.id;
  const { exchange, apiKey, apiSecret, apiPassword } = req.body;

  if (!exchange || !apiKey || !apiSecret) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const saved = await Exchange.findOneAndUpdate(
    { user: userId, exchange },
    {
      user: userId,
      exchange,
      apiKey: encrypt(apiKey),
      apiSecret: encrypt(apiSecret),
      apiPassword: apiPassword ? encrypt(apiPassword) : undefined,
      status: "CONNECTED_UNVERIFIED",
      lastSyncAt: null,
    },
    { upsert: true, new: true }
  );

  res.json({
    message:
      "Exchange saved. Click 'Sync Now' to verify API access.",
    exchange: {
      id: saved._id,
      exchange: saved.exchange,
      status: saved.status,
    },
  });
};

/**
 * GET USER EXCHANGES
 */
exports.getExchanges = async (req, res) => {
  const exchanges = await Exchange.find({ user: req.user.id }).select(
    "-apiKey -apiSecret -apiPassword"
  );

  res.json(exchanges);
};

/**
 * SYNC / VERIFY EXCHANGE
 * This is where REAL AUTH happens.
 */
const { syncExchangeTrades } = require(
  "../services/exchangeTradeSync.service"
);

exports.syncExchange = async (req, res) => {
  try {
    const result = await syncExchangeTrades(
      req.user.id,
      req.params.id
    );

    res.json({
      message: "Exchange trades synced successfully",
      ...result,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message || "Exchange sync failed",
    });
  }
};

