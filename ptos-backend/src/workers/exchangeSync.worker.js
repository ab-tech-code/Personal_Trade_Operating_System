const ExchangeSyncJob = require("../models/ExchangeSyncJob");
const { runExchangeSync } = require("../services/exchangeSync.service");

/**
 * Simple polling worker
 * ---------------------
 * This will be replaced by a real queue later (BullMQ / RabbitMQ).
 */
const startExchangeSyncWorker = () => {
  setInterval(async () => {
    const job = await ExchangeSyncJob.findOne({
      status: "pending",
    });

    if (job) {
      await runExchangeSync(job._id);
    }
  }, 5000); // poll every 5s
};

module.exports = startExchangeSyncWorker;
