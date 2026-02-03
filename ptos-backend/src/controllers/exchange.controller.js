const ExchangeConnection = require("../models/ExchangeConnection");

/**
 * Add Exchange Connection
 */
const addExchange = async (req, res) => {
  try {
    const { exchangeName, apiKey, apiSecret, label } = req.body;

    if (!exchangeName || !apiKey || !apiSecret) {
      return res.status(400).json({
        message: "Exchange name and keys are required",
      });
    }

    const connection = await ExchangeConnection.create({
      user: req.user._id,
      exchangeName,
      apiKey,
      apiSecret,
      label,
    });

    res.status(201).json({
      message: "Exchange connected",
      connection,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add exchange",
    });
  }
};

/**
 * Get User Exchanges
 */
const getUserExchanges = async (req, res) => {
  try {
    const exchanges = await ExchangeConnection.find({
      user: req.user._id,
    })
      .select("-apiKey -apiSecret")
      .sort({ createdAt: -1 });

    res.json(exchanges);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch exchanges",
    });
  }
};


/**
 * Delete Exchange Connection
 */
const deleteExchange = async (req, res) => {
  try {
    const connection = await ExchangeConnection.findById(req.params.id);

    if (!connection) {
      return res.status(404).json({
        message: "Connection not found",
      });
    }

    if (connection.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    await connection.deleteOne();

    res.json({ message: "Exchange removed" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete exchange",
    });
  }
};

const ExchangeSyncJob = require("../models/ExchangeSyncJob");

/**
 * Trigger Exchange Sync
 */
const triggerExchangeSync = async (req, res) => {
  try {
    const connection = await ExchangeConnection.findById(req.params.id);

    if (!connection) {
      return res.status(404).json({ message: "Exchange not found" });
    }

    if (connection.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const job = await ExchangeSyncJob.create({
      user: req.user._id,
      exchangeConnection: connection._id,
    });

    res.json({
      message: "Sync started",
      jobId: job._id,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to start sync" });
  }
};


module.exports = {
  addExchange,
  getUserExchanges,
  deleteExchange,
  triggerExchangeSync,
};
