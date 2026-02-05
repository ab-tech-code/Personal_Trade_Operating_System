const ccxt = require("ccxt");
const { decrypt } = require("../utils/encryption");

/**
 * Initializes a connection to an exchange using stored credentials
 */
exports.initExchange = async (connection) => {
  // ... (previous decryption code)
  
  const exchangeData = {
    apiKey: apiKey,
    secret: apiSecret,
    enableRateLimit: true,
  };

  // ONLY add the password/passphrase if it actually exists
  if (apiPassphrase && apiPassphrase.trim() !== "") {
    exchangeData.password = apiPassphrase;
  }

  const exchange = new ccxt[exchangeId](exchangeData);
  return exchange;
};