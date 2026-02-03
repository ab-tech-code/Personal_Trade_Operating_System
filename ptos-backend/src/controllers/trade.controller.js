const Trade = require("../models/Trade");


/**
 * Update Trade
 * ------------
 * Allows owner to edit a trade.
 */
const updateTrade = async (req, res) => {
  try {
    const trade = await Trade.findById(req.params.id);

    if (!trade) {
      return res.status(404).json({
        message: "Trade not found",
      });
    }

    // Ownership check
    if (trade.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to update this trade",
      });
    }

    // Apply updates
    Object.assign(trade, req.body);

    await trade.save();

    res.status(200).json({
      message: "Trade updated successfully",
      trade,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update trade",
    });
  }
};


/**
 * Delete Trade
 * ------------
 * Removes a trade owned by user.
 */
const deleteTrade = async (req, res) => {
  try {
    const trade = await Trade.findById(req.params.id);

    if (!trade) {
      return res.status(404).json({
        message: "Trade not found",
      });
    }

    // Ownership check
    if (trade.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to delete this trade",
      });
    }

    await trade.deleteOne();

    res.status(200).json({
      message: "Trade deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete trade",
    });
  }
};


/**
 * Create Trade
 * ------------
 * Adds a trade belonging to logged-in user.
 */
const createTrade = async (req, res) => {
  try {
    const tradeData = req.body;

    const trade = await Trade.create({
      ...tradeData,
      user: req.user._id, // owner
    });

    res.status(201).json({
      message: "Trade created successfully",
      trade,
    });
  } catch (error) {
    console.error("Create trade error:", error);
    res.status(500).json({
      message: "Failed to create trade",
    });
  }
};

/**
 * Get Trades with Filtering & Pagination
 */
const getTrades = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      symbol,
      strategy,
      status,
      startDate,
      endDate,
    } = req.query;

    const filters = {
      user: req.user._id,
    };

    // Optional filters
    if (symbol) filters.symbol = symbol.toUpperCase();
    if (strategy) filters.strategy = strategy;
    if (status) filters.status = status;

    // Date filter
    if (startDate || endDate) {
      filters.createdAt = {};
      if (startDate) filters.createdAt.$gte = new Date(startDate);
      if (endDate) filters.createdAt.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;

    const trades = await Trade.find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Trade.countDocuments(filters);

    res.status(200).json({
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      totalTrades: total,
      trades,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch trades",
    });
  }
};


module.exports = {
  createTrade,
  getTrades,
  updateTrade,
  deleteTrade,
};
