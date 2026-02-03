const express = require("express");
const protect = require("../middleware/auth.middleware");

const {
  createTrade,
  getTrades,
  updateTrade,
  deleteTrade,
} = require("../controllers/trade.controller");

const router = express.Router();

router.post("/", protect, createTrade);
router.get("/", protect, getTrades);

// Update trade
router.put("/:id", protect, updateTrade);

// Delete trade
router.delete("/:id", protect, deleteTrade);

module.exports = router;
