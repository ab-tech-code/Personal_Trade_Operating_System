import React from "react";

import { useEffect, useState } from "react";
import AppLayout from "../layouts/AppLayout";
import TradeRow from "../components/TradeRow";
import Loading from "../components/Loading";
import { Link } from "react-router-dom";
import { fetchTrades } from "../services/trades.service";

const Trades = () => {
  const [trades, setTrades] = useState([]);
  const [filters, setFilters] = useState({ symbol: "", side: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTrades = async () => {
      setLoading(true);
      try {
        const data = await fetchTrades(filters);
        setTrades(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadTrades();
  }, [filters]);

  return (
    <AppLayout>
      <h1>Trades</h1>
      
      <Link to="/app/trades/new" className="btn">
        + Add Trade
      </Link>

      {/* Filters */}
      <div className="trade-filters">
        <input
          placeholder="Symbol (e.g BTCUSDT)"
          value={filters.symbol}
          onChange={(e) =>
            setFilters({ ...filters, symbol: e.target.value })
          }
        />

        <select
          value={filters.side}
          onChange={(e) =>
            setFilters({ ...filters, side: e.target.value })
          }
        >
          <option value="">All</option>
          <option value="long">Long</option>
          <option value="short">Short</option>
        </select>
      </div>

      {/* Content */}
      {loading && <Loading />}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && trades.length === 0 && (
        <p className="empty-state">No trades found.</p>
      )}

      {!loading && trades.length > 0 && (
        <div className="trade-list">
          <div className="trade-header">
            <span>Symbol</span>
            <span>Side</span>
            <span>Entry</span>
            <span>PnL</span>
          </div>

          {trades.map((trade) => (
            <TradeRow key={trade._id} trade={trade} />
          ))}
        </div>
      )}
    </AppLayout>
  );
};

export default Trades;
