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
        const summaryData = await fetchDashboardSummary();
        const tradesData = await fetchRecentTrades();

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
        <p style={{ color: "red" }}>{error}</p>
        <button className="btn" onClick={handleLogout}>
          Logout
        </button>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container">
        <h1>Dashboard</h1>

        <div className="stats-grid">
          <StatCard
            label="Total PnL"
            value={`$${summary.totalPnL}`}
          />
          <StatCard
            label="Win Rate"
            value={`${summary.winRate}%`}
          />
          <StatCard
            label="Trades"
            value={summary.totalTrades}
          />
          <StatCard
            label="Last Activity"
            value={
              recentTrades.length > 0
                ? new Date(
                    recentTrades[0].closedAt
                  ).toLocaleDateString()
                : "—"
            }
          />
        </div>

        <RecentTrades trades={recentTrades} />

        <p>Your Personal Trading Operating System</p>

        <button className="btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
