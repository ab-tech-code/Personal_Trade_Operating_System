const mongoose = require("mongoose");
const Exchange = require("../models/Exchange");
const { encrypt } = require("../utils/encryption");

const {
  syncExchangeTrades,
} = require("../services/exchangeTradeSync.service");

/**
 * CONNECT EXCHANGE
 */
exports.connectExchange = async (req, res) => {
  try {
    const userId = req.user.id;
    const { exchange, apiKey, apiSecret, apiPassword } = req.body;

    if (!exchange || !apiKey || !apiSecret) {
      return res.status(400).json({
        message: "Missing required fields",
      });
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
        lastError: null,
      },
      { upsert: true, new: true }
    );

    res.json({
      message: "Exchange saved successfully",
      exchange: {
        id: saved._id,
        exchange: saved.exchange,
        status: saved.status,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to connect exchange",
    });
  }
};

/**
 * GET USER EXCHANGES
 */
exports.getExchanges = async (req, res) => {
  try {
    const exchanges = await Exchange.find({
      user: req.user.id,
    }).select("-apiKey -apiSecret -apiPassword");

    res.json(exchanges);
  } catch {
    res.status(500).json({
      message: "Failed to fetch exchanges",
    });
  }
};

/**
 * SYNC / VERIFY EXCHANGE
 */
exports.syncExchange = async (req, res) => {
  try {
    const userId = req.user.id;
    const exchangeId = req.params.id;

    // ✅ Validate ObjectId (fixes <!DOCTYPE error)
    if (!mongoose.Types.ObjectId.isValid(exchangeId)) {
      return res.status(400).json({
        message: "Invalid exchange ID",
      });
    }

    const exchange = await Exchange.findOne({
      _id: exchangeId,
      user: userId,
    });

    if (!exchange) {
      return res.status(404).json({
        message: "Exchange not found",
      });
    }

    // 🔒 Prevent double sync
    if (exchange.isSyncing) {
      return res.status(400).json({
        message: "Sync already in progress",
      });
    }

    // 🔒 Lock sync
    exchange.isSyncing = true;
    exchange.lastError = null;
    await exchange.save();

    let result;

    try {
      result = await syncExchangeTrades(userId, exchangeId);

      exchange.status = "VERIFIED";
      exchange.lastSyncStatus = "SUCCESS";
      exchange.lastSuccessfulSync = new Date();
    } catch (err) {
      exchange.status = "AUTH_FAILED";
      exchange.lastSyncStatus = "FAILED";
      exchange.lastError = err.message;

      await exchange.save();

      return res.status(400).json({
        message: err.message,
      });
    }

    // ✅ Unlock sync
    exchange.isSyncing = false;
    exchange.lastSyncAt = new Date();

    await exchange.save();

    res.json({
      message: "Exchange synced successfully",
      ...result,
    });
  } catch (err) {
    res.status(500).json({
      message: "Exchange sync failed",
    });
  }
};