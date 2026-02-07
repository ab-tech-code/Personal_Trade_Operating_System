class BaseExchangeAdapter {
  constructor(credentials) {
    this.credentials = credentials;
  }

  /**
   * Validate API keys / credentials
   */
  async connect() {
    throw new Error("connect() not implemented");
  }

  /**
   * Fetch raw trades from exchange
   */
  async fetchTrades() {
    throw new Error("fetchTrades() not implemented");
  }

  /**
   * Normalize raw trade into PTOS format
   */
  normalizeTrade(rawTrade) {
    throw new Error("normalizeTrade() not implemented");
  }
}

module.exports = BaseExchangeAdapter;
