const dotenv = require("dotenv");
const app = require("./src/app");
const connectDB = require("./src/config/db");
const startExchangeSyncWorker = require("./src/workers/exchangeSync.worker");


dotenv.config();

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 PTOS backend running on port ${PORT}`);
});

startExchangeSyncWorker();
