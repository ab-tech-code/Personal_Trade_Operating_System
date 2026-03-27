const cron = require("node-cron");

const Exchange = require("../models/Exchange");
const { syncExchangeTrades } = require("../services/exchangeTradeSync.service");

/**
 * Runs every 5 minutes (faster + controlled by interval)
 */
cron.schedule("*/5 * * * *", async () => {
  console.log("⏳ Running automatic exchange sync...");

  try {
    const exchanges = await Exchange.find({
      autoSync: true, // ✅ correct field
      status: "VERIFIED", // only verified exchanges
    });

    for (const exchange of exchanges) {
      try {
        if (exchange.isSyncing) {
          console.log(`⏭ Skipping ${exchange.exchange} (already syncing)`);
          continue;
        }

        if (exchange.status === "AUTH_FAILED") {
          console.log(`⚠️ Skipping ${exchange.exchange} (auth failed)`);
          continue;
        }

        if (exchange.lastSyncAt) {
          const minutesSinceLastSync =
            (Date.now() - new Date(exchange.lastSyncAt).getTime()) / 60000;

          const interval = exchange.syncInterval || 10;

          if (minutesSinceLastSync < interval) {
            continue;
          }
        }

        console.log(`🔄 Auto-syncing ${exchange.exchange}`);

        exchange.isSyncing = true;
        await exchange.save();

        try {
          const result = await syncExchangeTrades(
            exchange.user,
            exchange._id
          );

          exchange.lastSyncStatus = "SUCCESS";
          exchange.lastSuccessfulSync = new Date();
          exchange.status = "VERIFIED";

          console.log(`✅ ${exchange.exchange} synced`, result);
        } catch (err) {
          exchange.lastSyncStatus = "FAILED";
          exchange.lastError = err.message;
          exchange.status = "AUTH_FAILED";

          console.log(`❌ ${exchange.exchange} failed:`, err.message);
        }

        exchange.isSyncing = false;
        exchange.lastSyncAt = new Date();

        await exchange.save();
      } catch (innerError) {
        console.error(
          `⚠️ Unexpected error for ${exchange.exchange}:`,
          innerError.message
        );
      }
    }

    console.log("✔ Exchange auto-sync completed");
  } catch (error) {
    console.error("Auto-sync error:", error);
  }
});