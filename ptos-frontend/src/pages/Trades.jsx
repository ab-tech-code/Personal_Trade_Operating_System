import React, { useEffect, useState } from "react";
import AppLayout from "../layouts/AppLayout";
import Loading from "../components/Loading";
import { Link } from "react-router-dom";
import { fetchTrades, deleteTrade } from "../services/trades.service";
import "../styles/trades.css";

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
    if (!window.confirm("Delete this trade?")) return;

    try {
      await deleteTrade(id);
      loadTrades();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <AppLayout>
      <div className="trades-container">
        {/* Header */}
        <div className="trades-header">
          <h1>Trades</h1>
          <Link to="/app/trades/new" className="btn primary-btn">
            + Add Trade
          </Link>
        </div>

        {/* Filters */}
        <div className="filters-card">
          <input
            className="filter-input"
            placeholder="Search symbol (e.g. BTC)"
            value={filters.symbol}
            onChange={(e) =>
              setFilters({ ...filters, symbol: e.target.value })
            }
          />

          <select
            className="filter-select"
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
            className="filter-select"
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

        {/* States */}
        {loading && <Loading />}
        {error && <p className="error">{error}</p>}

        {!loading && trades.length === 0 && (
          <div className="empty-box">
            <p>No trades found</p>
          </div>
        )}

        {/* Table */}
        {!loading && trades.length > 0 && (
          <div className="table-card">
            <div className="trade-table">
              <div className="trade-header-row">
                <span>Symbol</span>
                <span>Side</span>
                <span>Status</span>
                <span>Source</span>
                <span>PnL</span>
                <span>Action</span>
              </div>

              {trades.map((trade) => {
                const pnlClass =
                  trade.pnl > 0
                    ? "pnl-profit"
                    : trade.pnl < 0
                    ? "pnl-loss"
                    : "pnl-neutral";

                return (
                  <div key={trade._id} className="trade-row">
                    <span className="symbol">{trade.symbol}</span>

                    <span
                      className={
                        trade.side === "buy"
                          ? "badge buy"
                          : "badge sell"
                      }
                    >
                      {trade.side.toUpperCase()}
                    </span>

                    <span className="status">{trade.status}</span>

                    <span className="source">
                      {trade.source === "manual"
                        ? "Manual"
                        : "Exchange"}
                    </span>

                    <span className={`pnl ${pnlClass}`}>
                      {trade.pnl > 0 && "+"}${trade.pnl}
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
                        <button className="btn disabled-btn" disabled>
                          Locked
                        </button>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Trades;