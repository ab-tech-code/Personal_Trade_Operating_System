const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth.middleware");

const controller = require("./settings.controller");

router.get("/", auth, controller.getSettings);

router.put("/profile", auth, controller.updateProfile);

router.put("/password", auth, controller.changePassword);

router.put("/preferences", auth, controller.updatePreferences);

router.put("/exchange", auth, controller.updateExchangeSettings);

router.put("/notifications", auth, controller.updateNotifications);

router.delete("/exchanges/disconnect", auth, controller.disconnectExchanges);

router.delete("/trades/reset", auth, controller.resetTrades);

router.delete("/account", auth, controller.deleteAccount);

module.exports = router;