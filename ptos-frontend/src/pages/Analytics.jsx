import React, { useEffect, useState } from "react";
import AppLayout from "../layouts/AppLayout";
import ChartPlaceholder from "../components/ChartPlaceholder";
import EquityCurveChart from "../components/EquityCurveChart";
import WinLossChart from "../components/WinLossChart";
import MonthlyPerformanceChart from "../components/MonthlyPerformanceChart"; // New Import
import { 
  fetchEquityCurve, 
  fetchWinLoss, 
  fetchMonthlyPerformance 
} from "../services/analytics.service"; // New Import
import Loading from "../components/Loading";

const Analytics = () => {
  const [equityCurve, setEquityCurve] = useState([]);
  const [winLoss, setWinLoss] = useState([]);
  const [monthlyPerformance, setMonthlyPerformance] = useState([]); // New State
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch all three datasets simultaneously
        const [equityData, winLossData, monthlyData] = await Promise.all([
          fetchEquityCurve(),
          fetchWinLoss(),
          fetchMonthlyPerformance(), // New fetch call
        ]);
        
        setEquityCurve(equityData);
        setWinLoss(winLossData);
        setMonthlyPerformance(monthlyData); // New state update
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

        {/* Win / Loss Distribution Section */}
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

        {/* Monthly Performance Section - Replaced Placeholder */}
        <div className="chart-placeholder">
          <h3>Monthly Performance</h3>
          {loading ? (
            <Loading />
          ) : monthlyPerformance.length === 0 ? (
            <p className="empty-state">No data yet</p>
          ) : (
            <MonthlyPerformanceChart data={monthlyPerformance} />
          )}
        </div>

        {/* Keeping remaining placeholder as it was */}
        <ChartPlaceholder title="Strategy Performance" />
      </div>
    </AppLayout>
  );
};

export default Analytics;