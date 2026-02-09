const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");

const {
  connectExchange,
  getExchanges,
  syncExchange,
} = require("../controllers/exchange.controller");

/**
 * Connect exchange (STORE KEYS ONLY — NO AUTH HERE)
 */
router.post("/connect", auth, connectExchange);

/**
 * List user exchanges
 */
router.get("/", auth, getExchanges);

/**
 * Verify + sync exchange (AUTH HAPPENS HERE)
 */
router.post("/:id/sync", auth, syncExchange);

module.exports = router;
