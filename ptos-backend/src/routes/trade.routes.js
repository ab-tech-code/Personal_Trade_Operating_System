const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const tradeCtrl = require("../controllers/trade.controller");

router.post("/manual", auth, tradeCtrl.createManualTrade);
router.get("/", auth, tradeCtrl.getTrades);
router.put("/:id", auth, tradeCtrl.updateTrade);
router.delete("/:id", auth, tradeCtrl.deleteTrade);

module.exports = router;
