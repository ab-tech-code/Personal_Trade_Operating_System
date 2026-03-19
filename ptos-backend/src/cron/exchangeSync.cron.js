const cron = require("node-cron");

const Exchange = require("../models/Exchange");
const { syncExchangeTrades } = require("../services/exchangeTradeSync.service");

/**
 * Runs every 10 minutes
 */
cron.schedule("*/10 * * * *", async () => {
  console.log("⏳ Running automatic exchange sync...");

  try {
    const exchanges = await Exchange.find({
      connected: true,
    }).populate("user");

    for (const exchange of exchanges) {
      if (!exchange.user) continue;

      const autoSync = exchange.user.exchangeSettings?.autoSync;

      if (!autoSync) continue;

      try {
        console.log(
          `🔄 Syncing ${exchange.exchange} for user ${exchange.user._id}`
        );

        const result = await syncExchangeTrades(
          exchange.user._id,
          exchange._id
        );

        console.log(
          `✅ Synced ${exchange.exchange}:`,
          result
        );
      } catch (error) {
        console.log(
          `❌ Sync failed for ${exchange.exchange}:`,
          error.message
        );
      }
    }

    console.log("✔ Exchange auto-sync completed");
  } catch (error) {
    console.error("Auto-sync error:", error);
  }
});