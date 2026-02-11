import React, { useEffect, useState } from "react";
import AppLayout from "../layouts/AppLayout";
import Loading from "../components/Loading";
import { Link } from "react-router-dom";
import { fetchTrades, deleteTrade } from "../services/trades.service";

const Trades = () => {
  const [trades, setTrades] = useState([]);
  const [filters, setFilters] = useState({
    symbol: "",
    source: "",
    status: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  useEffect(() => {
    loadTrades();
  }, [filters]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this trade?")) {
      return;
    }

    try {
      await deleteTrade(id);
      loadTrades();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <AppLayout>
      <div className="container">
        <h1>Trades</h1>

        <Link to="/app/trades/new" className="btn">
          + Add Manual Trade
        </Link>

        {/* Filters */}
        <div className="trade-filters">
          <input
            placeholder="Symbol"
            value={filters.symbol}
            onChange={(e) =>
              setFilters({ ...filters, symbol: e.target.value })
            }
          />

          <select
            value={filters.source}
            onChange={(e) =>
              setFilters({ ...filters, source: e.target.value })
            }
          >
            <option value="">All Sources</option>
            <option value="manual">Manual</option>
            <option value="exchange">Exchange</option>
          </select>

          <select
            value={filters.status}
            onChange={(e) =>
              setFilters({ ...filters, status: e.target.value })
            }
          >
            <option value="">All Status</option>
            <option value="OPEN">Open</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>

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
              <span>Status</span>
              <span>Source</span>
              <span>PnL</span>
              <span>Actions</span>
            </div>

            {trades.map((trade) => (
              <div key={trade._id} className="trade-row">
                <span>{trade.symbol}</span>
                <span>{trade.side.toUpperCase()}</span>
                <span>{trade.status}</span>
                <span>
                  {trade.source === "manual" ? "🟢 Manual" : "🔵 Exchange"}
                </span>
                <span
                  style={{
                    color:
                      trade.pnl > 0
                        ? "green"
                        : trade.pnl < 0
                        ? "red"
                        : "gray",
                  }}
                >
                  {trade.pnl}
                </span>

                <span>
                  {trade.source === "manual" ? (
                    <button
                      className="btn danger-btn"
                      onClick={() => handleDelete(trade._id)}
                    >
                      Delete
                    </button>
                  ) : (
                    <button
                      className="btn disabled-btn"
                      disabled
                      title="Exchange trades cannot be deleted"
                    >
                      Locked
                    </button>
                  )}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Trades;
