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
exports.syncExchange = async (req, res) => {
  const userId = req.user.id;
  const exchangeId = req.params.id;

  const exchangeConfig = await Exchange.findOne({
    _id: exchangeId,
    user: userId,
  });

  if (!exchangeConfig) {
    return res.status(404).json({ message: "Exchange not found" });
  }

  try {
    const ExchangeClass = ccxt[exchangeConfig.exchange];

    if (!ExchangeClass) {
      throw new Error("Unsupported exchange");
    }

    const exchange = new ExchangeClass({
      apiKey: decrypt(exchangeConfig.apiKey),
      secret: decrypt(exchangeConfig.apiSecret),
      password: exchangeConfig.apiPassword
        ? decrypt(exchangeConfig.apiPassword)
        : undefined,
      enableRateLimit: true,
    });

    /**
     * 🔥 REAL AUTH CHECK
     * If this fails → keys are invalid
     */
    await exchange.fetchMyTrades(undefined, undefined, 1);

    exchangeConfig.status = "VERIFIED";
    exchangeConfig.lastSyncAt = new Date();
    await exchangeConfig.save();

    return res.json({
      message: "Exchange verified successfully",
      status: exchangeConfig.status,
      lastSyncAt: exchangeConfig.lastSyncAt,
    });
  } catch (err) {
    exchangeConfig.status = "AUTH_FAILED";
    await exchangeConfig.save();

    return res.status(401).json({
      message:
        "API authentication failed. Check API keys & permissions.",
      status: exchangeConfig.status,
    });
  }
};
