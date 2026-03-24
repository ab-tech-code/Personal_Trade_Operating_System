import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import StatCard from "../components/StatCard";
import RecentTrades from "../components/RecentTrades";
import Loading from "../components/Loading";
import {
  fetchDashboardSummary,
  fetchRecentTrades,
} from "../services/dashboard.service";

import "../styles/dashboard.css";

const Dashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [summary, setSummary] = useState(null);
  const [recentTrades, setRecentTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [summaryData, tradesData] = await Promise.all([
          fetchDashboardSummary(),
          fetchRecentTrades(),
        ]);

        setSummary(summaryData);
        setRecentTrades(tradesData);
      } catch (err) {
        setError("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <AppLayout>
        <Loading />
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="dashboard-error">
          <p>{error}</p>
          <button className="btn danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </AppLayout>
    );
  }

  const formattedPnL =
    summary?.totalPnL >= 0
      ? `+$${Number(summary.totalPnL).toFixed(2)}`
      : `-$${Math.abs(summary.totalPnL).toFixed(2)}`;

  const pnlClass =
    summary?.totalPnL >= 0 ? "positive" : "negative";

  const formattedWinRate = `${Number(summary?.winRate || 0).toFixed(1)}%`;

  const lastActivity =
    recentTrades.length > 0 && recentTrades[0].closedAt
      ? new Date(recentTrades[0].closedAt).toLocaleDateString()
      : "—";

  return (
    <AppLayout>
      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <button className="btn danger" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <StatCard
            label="Total PnL"
            value={formattedPnL}
            className={pnlClass}
          />
          <StatCard label="Win Rate" value={formattedWinRate} />
          <StatCard
            label="Total Trades"
            value={summary?.totalTrades || 0}
          />
          <StatCard label="Last Activity" value={lastActivity} />
        </div>

        {/* Recent Trades */}
        <div className="dashboard-section">
          <RecentTrades trades={recentTrades} />
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;