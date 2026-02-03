import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import StatCard from "../components/StatCard";
import RecentTrades from "../components/RecentTrades";
import Loading from "../components/Loading";
import { fetchDashboardSummary } from "../services/dashboard.service";

const Dashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const summary = await fetchDashboardSummary();
        setData(summary);
      } catch (err) {
        setError(err.message);
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
        <div className="container">
          <p style={{ color: "red" }}>{error}</p>
          <button className="btn" onClick={handleLogout}>Logout</button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container">
        <h1>Dashboard</h1>

        <div className="stats-grid">
          <StatCard label="Total PnL" value={`$${data.totalPnL}`} />
          <StatCard label="Win Rate" value={`${data.winRate}%`} />
          <StatCard label="Trades" value={data.tradeCount} />
          <StatCard
            label="Last Activity"
            value={
              data.lastActivity
                ? new Date(data.lastActivity).toLocaleDateString()
                : "—"
            }
          />
        </div>

        {/* Passing the trades prop as we updated in the previous step */}
        <RecentTrades trades={data.recentTrades} />

        <p>Your Personal Trading Operating System</p>
        
        <button className="btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </AppLayout>
  );
};

export default Dashboard;