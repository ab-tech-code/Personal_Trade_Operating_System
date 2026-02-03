const express = require("express");
const protect = require("../middleware/auth.middleware");

const {
  addExchange,
  getUserExchanges,
  deleteExchange,
  triggerExchangeSync,

} = require("../controllers/exchange.controller");

const router = express.Router();

router.post("/", protect, addExchange);
router.get("/", protect, getUserExchanges);
router.delete("/:id", protect, deleteExchange);
router.post("/:id/sync", protect, triggerExchangeSync);


module.exports = router;
