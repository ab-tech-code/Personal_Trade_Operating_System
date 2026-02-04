import React, { useEffect, useState } from "react";
import AppLayout from "../layouts/AppLayout";
import ChartPlaceholder from "../components/ChartPlaceholder";
import EquityCurveChart from "../components/EquityCurveChart";
import WinLossChart from "../components/WinLossChart"; // New Import
import { fetchEquityCurve, fetchWinLoss } from "../services/analytics.service"; // New Import
import Loading from "../components/Loading";

const Analytics = () => {
  const [equityCurve, setEquityCurve] = useState([]);
  const [winLoss, setWinLoss] = useState([]); // New State
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch both datasets
        const [equityData, winLossData] = await Promise.all([
          fetchEquityCurve(),
          fetchWinLoss(),
        ]);
        
        setEquityCurve(equityData);
        setWinLoss(winLossData);
      } catch (err) {
        console.error("Error loading analytics data:", err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <AppLayout>
      <h1>Analytics</h1>

      <div className="analytics-grid">
        {/* Equity Curve Section */}
        <div className="chart-placeholder">
          <h3>Equity Curve</h3>
          {loading ? (
            <Loading />
          ) : equityCurve.length === 0 ? (
            <p className="empty-state">No trades yet</p>
          ) : (
            <EquityCurveChart data={equityCurve} />
          )}
        </div>

        {/* Win / Loss Distribution Section - Replaced Placeholder */}
        <div className="chart-placeholder">
          <h3>Win / Loss Distribution</h3>
          {loading ? (
            <Loading />
          ) : winLoss.length === 0 ? (
            <p className="empty-state">No data available</p>
          ) : (
            <WinLossChart data={winLoss} />
          )}
        </div>

        {/* Keeping other placeholders as they were */}
        <ChartPlaceholder title="Monthly Performance" />
        <ChartPlaceholder title="Strategy Performance" />
      </div>
    </AppLayout>
  );
};

export default Analytics;