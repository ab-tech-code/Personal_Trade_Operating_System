import React, { useEffect, useState } from "react";
import AppLayout from "../layouts/AppLayout";
import Loading from "../components/Loading";
import MonthlyPerformanceChart from "../components/MonthlyPerformanceChart";
import StrategyPerformanceChart from "../components/StrategyPerformanceChart";
import WinLossChart from "../components/WinLossChart";

import {
  fetchDashboardSummary,
  fetchMonthlyPerformance,
  fetchStrategyPerformance,
} from "../services/analytics.service";

const Analytics = () => {
  const [summary, setSummary] = useState(null);
  const [monthlyPerformance, setMonthlyPerformance] = useState([]);
  const [strategyPerformance, setStrategyPerformance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [summaryData, monthlyData, strategyData] =
          await Promise.all([
            fetchDashboardSummary(),
            fetchMonthlyPerformance(),
            fetchStrategyPerformance(),
          ]);

        setSummary(summaryData);
        setMonthlyPerformance(monthlyData);
        setStrategyPerformance(strategyData);
      } catch (err) {
        console.error("Analytics load failed:", err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <AppLayout>
      <h1>Analytics</h1>

      {loading && <Loading />}

      {!loading && (
        <div className="analytics-grid">
          {/* Win / Loss Distribution */}
          <div className="chart-placeholder">
            <h3>Win / Loss Distribution</h3>
            {!summary || summary.totalTrades === 0 ? (
              <p className="empty-state">No trades yet</p>
            ) : (
              <WinLossChart
                data={[
                  { name: "Wins", value: summary.wins },
                  { name: "Losses", value: summary.losses },
                ]}
              />
            )}
          </div>

          {/* Monthly Performance */}
          <div className="chart-placeholder">
            <h3>Monthly Performance</h3>
            {monthlyPerformance.length === 0 ? (
              <p className="empty-state">No data yet</p>
            ) : (
              <MonthlyPerformanceChart data={monthlyPerformance} />
            )}
          </div>

          {/* Strategy Performance */}
          <div className="chart-placeholder">
            <h3>Strategy Performance</h3>
            {strategyPerformance.length === 0 ? (
              <p className="empty-state">No strategy data yet</p>
            ) : (
              <StrategyPerformanceChart
                data={strategyPerformance}
              />
            )}
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default Analytics;
